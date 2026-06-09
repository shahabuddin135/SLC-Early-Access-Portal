import logging
from datetime import datetime, timezone
from urllib.parse import quote

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.security import (
    create_access_token,
    create_email_verification_token,
    create_password_reset_token,
    decode_email_verification_token,
    decode_password_reset_token,
    hash_password,
    password_hash_fingerprint,
    verify_password,
)
from app.models.user import User
from app.schemas.auth import (
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    MessageResponse,
    RegisterRequest,
    ResetPasswordRequest,
    TokenResponse,
    UserResponse,
)
from app.services.email_service import (
    send_password_reset_email,
    send_verification_email,
)

logger = logging.getLogger(__name__)


async def register_user(data: RegisterRequest, session: AsyncSession) -> User:
    result = await session.execute(select(User).where(User.email == data.email))
    existing = result.scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    user = User(
        name=data.name,
        email=data.email,
        github_id=data.github_id,
        password_hash=hash_password(data.password),
    )
    session.add(user)
    await session.commit()
    await session.refresh(user)
    return user


async def login_user(data: LoginRequest, session: AsyncSession) -> TokenResponse:
    result = await session.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
        )

    token = create_access_token({"sub": str(user.id)})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse(id=user.id, name=user.name, email=user.email),
    )


async def request_password_reset(
    data: ForgotPasswordRequest,
    session: AsyncSession,
    base_url: str,
) -> ForgotPasswordResponse:
    result = await session.execute(select(User).where(User.email == data.email))
    user = result.scalar_one_or_none()

    message = "If an account exists for that email, reset instructions have been sent."
    if not user:
        return ForgotPasswordResponse(message=message)

    token = create_password_reset_token(
        user_id=user.id,
        email=user.email,
        password_hash=user.password_hash,
    )
    reset_url = f"{base_url.rstrip('/')}/reset-password?token={quote(token, safe='')}"
    email_sent = await send_password_reset_email(
        email=user.email,
        name=user.name,
        reset_url=reset_url,
    )

    if not email_sent:
        logger.warning("Password reset email could not be sent to %s", user.email)

    return ForgotPasswordResponse(message=message)


async def reset_password(
    data: ResetPasswordRequest,
    session: AsyncSession,
) -> MessageResponse:
    payload = decode_password_reset_token(data.token)

    try:
        user_id = int(payload["sub"])
    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link",
        )

    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link",
        )

    if payload.get("email") != user.email or payload.get("pwd") != password_hash_fingerprint(
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired reset link",
        )

    if verify_password(data.new_password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Choose a different password than your current one",
        )

    user.password_hash = hash_password(data.new_password)
    session.add(user)
    await session.commit()

    return MessageResponse(message="Password reset successful. You can now log in.")


async def send_email_verification(user: User, base_url: str) -> MessageResponse:
    """Email the current user a verification link. Idempotent for already-verified
    accounts (returns success without re-sending)."""
    if user.email_verified:
        return MessageResponse(message="Your email is already verified.")

    token = create_email_verification_token(user_id=user.id, email=user.email)
    verify_url = f"{base_url.rstrip('/')}/verify-email?token={quote(token, safe='')}"
    sent = await send_verification_email(
        email=user.email, name=user.name, verify_url=verify_url
    )
    if not sent:
        # The requester is authenticated and verifying their own address, so there's
        # no account-enumeration concern — surface the real failure so they can retry
        # (e.g. a transient email-provider/DNS hiccup) instead of being told it sent.
        logger.warning("Verification email could not be sent to %s", user.email)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="We couldn't send the verification email right now. Please try again in a moment.",
        )

    return MessageResponse(
        message="Verification email sent. Check your inbox to confirm your address."
    )


async def verify_email(token: str, session: AsyncSession) -> MessageResponse:
    payload = decode_email_verification_token(token)

    try:
        user_id = int(payload["sub"])
    except (KeyError, TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification link",
        )

    result = await session.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()

    if not user or payload.get("email") != user.email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification link",
        )

    if not user.email_verified:
        user.email_verified = True
        user.email_verified_at = datetime.now(timezone.utc).replace(tzinfo=None)
        session.add(user)
        await session.commit()

    return MessageResponse(message="Email verified. You can now request access.")
