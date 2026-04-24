import logging
from urllib.parse import quote

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.config import settings
from app.core.security import (
    create_access_token,
    create_password_reset_token,
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
from app.services.email_service import send_password_reset_email

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
    reset_url = (
        f"{settings.FRONTEND_URL.rstrip('/')}"
        f"/reset-password?token={quote(token, safe='')}"
    )
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
