"""
Gmail Polling Service
Orchestrates the fetch → analyze → store → alert pipeline for connected Gmail accounts.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import List

from sqlalchemy.orm import Session

from app.core.logging import get_logger
from app.database.models.models import EmailAccount, ThreatType
from app.database.session import SessionLocal
from app.services.gmail_service import gmail_service
from app.services.alert_service import alert_service

logger = get_logger(__name__)


class PollingService:
    """
    Core polling orchestrator.
    Called by Celery beat every GMAIL_POLL_INTERVAL_SECONDS.
    """

    def poll_all_accounts(self) -> None:
        """
        Main entry point for the Celery periodic task.
        Fetches all active Gmail accounts and polls each one.
        """
        db: Session = SessionLocal()
        try:
            accounts: List[EmailAccount] = (
                db.query(EmailAccount)
                .filter(EmailAccount.is_active == True)
                .filter(EmailAccount.provider == "gmail")
                .all()
            )

            logger.info(f"Polling {len(accounts)} active Gmail account(s).")

            for account in accounts:
                try:
                    self._poll_single_account(account, db)
                except Exception as exc:
                    logger.error(
                        f"Error polling account {account.email_address}: {exc}",
                        exc_info=True,
                    )

        finally:
            db.close()

    def _poll_single_account(self, account: EmailAccount, db: Session) -> None:
        """Fetch new emails for a single account and process each one."""

        # Refresh access token if needed
        if not account.access_token:
            logger.warning(f"Account {account.email_address} has no access token, skipping.")
            return

        emails = gmail_service.fetch_new_emails(account, max_results=25)
        if not emails:
            logger.debug(f"No new emails for {account.email_address}")
            self._update_sync_time(account, db)
            return

        logger.info(f"Fetched {len(emails)} new emails from {account.email_address}")

        for email_data in emails:
            self._process_email(email_data, account, db)

        self._update_sync_time(account, db)

    def _process_email(
        self,
        email_data: dict,
        account: EmailAccount,
        db: Session,
    ) -> None:
        """
        Run a single fetched email through the full threat analysis pipeline.
        Imports here to avoid circular imports.
        """
        # Lazy imports to avoid circular deps at module level
        from app.services.email_service import email_service
        from app.schemas.schemas import EmailAnalysisRequest

        try:
            request = EmailAnalysisRequest(
                sender=email_data.get("sender", "unknown@gmail.com")[:255],
                subject=email_data.get("subject", "(No Subject)")[:1000],
                body=email_data.get("body", "")[:50_000],
            )

            result = email_service.analyze(request, db, user_id=account.user_id)

            # Trigger alert if threat detected
            if result.threat_id:
                from app.database.models.models import Threat
                threat = db.query(Threat).filter(Threat.id == result.threat_id).first()
                if threat:
                    alert_service.maybe_create_alert(threat, db)

            logger.info(
                f"Polled email from {account.email_address}: "
                f"score={result.risk_score} level={result.threat_level}"
            )

        except Exception as exc:
            logger.error(
                f"Failed to process email '{email_data.get('subject')}' "
                f"from {account.email_address}: {exc}",
                exc_info=True,
            )

    def _update_sync_time(self, account: EmailAccount, db: Session) -> None:
        account.last_synced_at = datetime.now(timezone.utc)
        db.commit()


polling_service = PollingService()
