from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserResponse


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
