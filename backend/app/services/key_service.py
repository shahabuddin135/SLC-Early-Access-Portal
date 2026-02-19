import secrets
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.key import Key
from app.models.user import User
from app.services.token_service import create_download_token


def _make_key_value() -> str:
    """Generate a random key in XXXX-XXXX-XXXX-XXXX format."""
    return "-".join(secrets.token_hex(2).upper() for _ in range(4))


async def generate_keys(n: int, session: AsyncSession) -> list[Key]:
    """Generate n unique one-time download keys and persist them."""
    keys: list[Key] = []
    for _ in range(n):
        # Retry on unlikely collision
        for _attempt in range(5):
            value = _make_key_value()
            existing = await session.execute(
                select(Key).where(Key.key_value == value)
            )
            if existing.scalar_one_or_none() is None:
                break
        key = Key(key_value=value)
        session.add(key)
        keys.append(key)

    await session.commit()
    for key in keys:
        await session.refresh(key)
    return keys


async def list_keys(session: AsyncSession) -> list[Key]:
    result = await session.execute(
        select(Key).order_by(Key.created_at.desc())
    )
    return list(result.scalars().all())


async def redeem_key(
    key_value: str,
    user: User,
    session: AsyncSession,
) -> str:
    """Atomically validate + mark a key used, then return a short-lived download token."""
    # SELECT FOR UPDATE prevents race conditions
    result = await session.execute(
        select(Key).where(Key.key_value == key_value).with_for_update()
    )
    key: Optional[Key] = result.scalar_one_or_none()

    if key is None or key.used:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or already used download key.",
        )

    # Mark used atomically inside the same transaction
    key.used = True
    key.used_at = datetime.now(timezone.utc).replace(tzinfo=None)
    key.used_by = user.email
    session.add(key)
    await session.commit()

    # Issue single-use 60-second download token
    return await create_download_token(user.id, session)
