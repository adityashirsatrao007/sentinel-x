"""
Authentication Routes
POST /auth/register  — Create a new user account
POST /auth/login     — Authenticate and receive a JWT
GET  /auth/me        — Return current user profile
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from app.core.limiter import limiter

from app.core.security import hash_password, verify_password, create_access_token
from app.core.config import settings
from app.database.session import get_db
from app.database.models.models import User, UserRole
from app.schemas.schemas import (
    UserRegisterRequest,
    UserLoginRequest,
    TokenResponse,
    UserResponse,
    UserInviteRequest,
)
from typing import List
from app.api.dependencies.auth import get_current_user, require_role
from app.core.logging import get_logger

logger = get_logger(__name__)

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user account",
)
@limiter.limit("5/hour")
def register(request: UserRegisterRequest, fastapi_request: Request, db: Session = Depends(get_db)) -> UserResponse:
    """Create a new user with hashed password. Fails if email already exists."""
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"User with email '{request.email}' already exists.",
        )
        
    org_id = None
    if request.role == "soc" and request.organization_name:
        from app.database.models.models import Organization
        org = db.query(Organization).filter(Organization.name == request.organization_name).first()
        if org:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Organization already exists.")
        org = Organization(name=request.organization_name)
        db.add(org)
        db.commit()
        db.refresh(org)
        org_id = org.id

    user = User(
        name=request.name,
        email=request.email,
        hashed_password=hash_password(request.password),
        role=UserRole(request.role),
        organization_id=org_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    logger.info(f"New user registered: {user.email} (role={user.role})")
    return UserResponse.model_validate(user)

@router.post(
    "/invite",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Invite a new user to the organization (SOC only)",
)
def invite_user(
    request: UserInviteRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.soc, UserRole.sysadmin]))
) -> UserResponse:
    if not current_user.organization_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="You do not belong to an organization.")
        
    existing = db.query(User).filter(User.email == request.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="User already exists.")

    user = User(
        name=request.name,
        email=request.email,
        hashed_password=hash_password(request.password),
        role=UserRole(request.role),
        organization_id=current_user.organization_id
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    logger.info(f"User invited: {user.email} by {current_user.email}")
    return UserResponse.model_validate(user)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Authenticate and receive a JWT access token",
)
@limiter.limit("10/minute")
def login(request: UserLoginRequest, fastapi_request: Request, db: Session = Depends(get_db)) -> TokenResponse:
    """Validate credentials and issue a JWT access token."""
    user = db.query(User).filter(User.email == request.email).first()

    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated. Contact an administrator.",
        )

    token = create_access_token({"sub": str(user.id), "role": user.role.value})
    logger.info(f"User logged in: {user.email}")

    return TokenResponse(
        access_token=token,
        token_type="bearer",
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
    )


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Retrieve the current authenticated user's profile",
)
def me(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Return the authenticated user's profile data."""
    return UserResponse.model_validate(current_user)

@router.get(
    "/users",
    response_model=List[UserResponse],
    summary="List all users in the organization (SOC only)",
)
def list_org_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role([UserRole.soc, UserRole.sysadmin]))
) -> List[UserResponse]:
    if not current_user.organization_id:
        return []
    users = db.query(User).filter(User.organization_id == current_user.organization_id).all()
    return [UserResponse.model_validate(u) for u in users]
