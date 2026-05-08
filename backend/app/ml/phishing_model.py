"""
NLP Phishing Detection Model
Uses DistilBERT via HuggingFace Transformers for zero-shot phishing classification.
Falls back to keyword-heuristic scoring if the model is unavailable.
"""

from __future__ import annotations

import re
from functools import lru_cache
from typing import Dict, List, Optional, Tuple

from app.core.config import settings
from app.core.logging import get_logger
from app.ml.llm_service import llm_service

logger = get_logger(__name__)

# ─── Label mapping ────────────────────────────────────────────────────────────
LABEL_SCORES: Dict[str, float] = {
    "safe": 0.0,
    "phishing": 85.0,
    "scam": 75.0,
    "credential_theft": 95.0,
    "malicious_link": 80.0,
    "impersonation": 70.0,
}

CLASSIFICATION_LABELS = list(LABEL_SCORES.keys())

# ─── Phishing keyword heuristics (fallback / supplemental) ────────────────────
PHISHING_KEYWORDS = [
    r"\bverify\s+your\s+account\b",
    r"\bclick\s+here\b",
    r"\burgent(ly)?\b",
    r"\bimmediate(ly)?\b",
    r"\bsuspicious\s+activity\b",
    r"\byour\s+password\b",
    r"\bconfirm\s+your\b",
    r"\bupdate\s+your\s+(billing|payment|credit)\b",
    r"\bwon\s+a\s+prize\b",
    r"\bclaim\s+your\s+(reward|prize)\b",
    r"\baccount\s+(suspend|lock|block|limit)\w*\b",
    r"\bsocial\s+security\b",
    r"\bbank\s+(account|details|info)\b",
    r"\blogin\s+attempt\b",
    r"\bunusual\s+(activity|sign.in)\b",
]

COMPILED_PATTERNS = [re.compile(p, re.IGNORECASE) for p in PHISHING_KEYWORDS]


class PhishingModel:
    """
    Phishing / scam NLP classifier.

    Attempts to load a HuggingFace zero-shot pipeline on first use.
    Gracefully degrades to keyword scoring if transformers is unavailable.
    """

    def __init__(self) -> None:
        self._pipeline = None
        self._loaded = False
        self._load_error: Optional[str] = None

    def _load(self) -> None:
        if self._loaded:
            return
        try:
            from transformers import pipeline  # type: ignore

            logger.info("Loading NLP zero-shot classification pipeline…")
            self._pipeline = pipeline(
                "zero-shot-classification",
                model=settings.NLP_MODEL_NAME,
                device=-1,  # CPU; set 0 for CUDA GPU
            )
            logger.info("NLP pipeline loaded successfully.")
        except Exception as exc:
            self._load_error = str(exc)
            logger.warning(
                f"HuggingFace pipeline unavailable ({exc}). "
                "Falling back to keyword heuristics."
            )
        finally:
            self._loaded = True

    # ──────────────────────────────────────────────────────────────────────────

    def classify(self, text: str) -> Tuple[str, float, float]:
        """
        Classify text into a threat label.

        Returns:
            (label, nlp_score_0_100, confidence_0_1)
        """
        self._load()

        # ─── Priority 1: LLM Inference (Qwen 2.5 via HF API) ──────────────────
        if llm_service.enabled:
            llm_result = llm_service.analyze_text(text)
            if llm_result:
                logger.info(f"LLM classification successful: {llm_result['label']}")
                return (
                    llm_result.get("label", "safe"),
                    float(llm_result.get("risk_score", 0.0)),
                    float(llm_result.get("confidence", 0.0)),
                )

        # ─── Priority 2: Local Transformers Model (DistilBERT) ────────────────
        if self._pipeline is not None:
            return self._classify_with_model(text)

        # ─── Priority 3: Keyword Heuristics (Fallback) ────────────────────────
        return self._classify_with_heuristics(text)

    def _classify_with_model(self, text: str) -> Tuple[str, float, float]:
        """Use HuggingFace zero-shot classifier."""
        result = self._pipeline(
            text[:512],  # truncate to model max length
            candidate_labels=CLASSIFICATION_LABELS,
        )
        top_label: str = result["labels"][0]
        top_score: float = result["scores"][0]

        # Map label confidence to 0-100 NLP score
        base = LABEL_SCORES.get(top_label, 0.0)
        nlp_score = base * top_score
        return top_label, round(nlp_score, 2), round(top_score, 4)

    def _classify_with_heuristics(self, text: str) -> Tuple[str, float, float]:
        """Keyword-regex heuristic fallback classifier."""
        matches = sum(1 for p in COMPILED_PATTERNS if p.search(text))
        hit_ratio = matches / len(COMPILED_PATTERNS)
        nlp_score = round(min(hit_ratio * 120, 100.0), 2)
        confidence = round(min(hit_ratio * 1.5, 1.0), 4)

        if nlp_score >= 80:
            label = "phishing"
        elif nlp_score >= 60:
            label = "scam"
        elif nlp_score >= 40:
            label = "malicious_link"
        elif nlp_score >= 20:
            label = "impersonation"
        else:
            label = "safe"

        return label, nlp_score, confidence


# ─── Singleton ────────────────────────────────────────────────────────────────
phishing_model = PhishingModel()
