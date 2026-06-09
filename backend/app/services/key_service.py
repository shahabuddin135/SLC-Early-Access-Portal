import secrets
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import func, or_
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


async def generate_assigned_key(email: str, session: AsyncSession) -> Key:
    """Mint a single unique key bound to `email`. Reuses the same value format and
    collision-retry logic as generate_keys; the key can only be redeemed by that
    account, so it can never be handed to the wrong person."""
    value = _make_key_value()
    for _attempt in range(5):
        existing = await session.execute(select(Key).where(Key.key_value == value))
        if existing.scalar_one_or_none() is None:
            break
        value = _make_key_value()

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    key = Key(key_value=value, assigned_email=email, assigned_at=now)
    session.add(key)
    await session.commit()
    await session.refresh(key)
    return key


async def list_keys(session: AsyncSession) -> list[Key]:
    result = await session.execute(
        select(Key).order_by(Key.created_at.desc())
    )
    return list(result.scalars().all())


async def get_active_assigned_key(email: str, session: AsyncSession) -> Optional[str]:
    """The user's most recent unused key bound to their email, if any — used to
    reveal/copy the key on their dashboard."""
    result = await session.execute(
        select(Key)
        .where(func.lower(Key.assigned_email) == email.lower(), Key.used.is_(False))
        .order_by(Key.assigned_at.desc())
        .limit(1)
    )
    key = result.scalar_one_or_none()
    return key.key_value if key else None


def _apply_key_filters(stmt, q: Optional[str], status_filter: Optional[str]):
    if q:
        like = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                Key.key_value.ilike(like),
                Key.assigned_email.ilike(like),
                Key.used_by.ilike(like),
            )
        )
    if status_filter == "used":
        stmt = stmt.where(Key.used.is_(True))
    elif status_filter == "unused":
        stmt = stmt.where(Key.used.is_(False))
    return stmt


async def search_keys(
    session: AsyncSession,
    *,
    q: Optional[str] = None,
    status_filter: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
) -> tuple[list[Key], int]:
    base = _apply_key_filters(select(Key), q, status_filter)
    total_result = await session.execute(
        _apply_key_filters(select(func.count(Key.id)), q, status_filter)
    )
    total = int(total_result.scalar_one())
    rows = await session.execute(
        base.order_by(Key.created_at.desc()).offset(offset).limit(limit)
    )
    return list(rows.scalars().all()), total


async def suggest_keys(session: AsyncSession, *, q: str, limit: int = 5) -> list[str]:
    if not q or not q.strip():
        return []
    like = f"%{q.strip()}%"
    result = await session.execute(
        select(Key.key_value)
        .where(or_(Key.key_value.ilike(like), Key.assigned_email.ilike(like), Key.used_by.ilike(like)))
        .distinct()
        .order_by(Key.key_value)
        .limit(limit)
    )
    return [row for row in result.scalars().all()]


async def key_stats(session: AsyncSession) -> dict[str, int]:
    total_result = await session.execute(select(func.count(Key.id)))
    used_result = await session.execute(
        select(func.count(Key.id)).where(Key.used.is_(True))
    )
    total = int(total_result.scalar_one())
    used = int(used_result.scalar_one())
    return {"total": total, "used": used, "unused": total - used}


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

    # A key minted for a specific account can only be redeemed by that account.
    # Legacy open-pool keys (assigned_email is NULL) remain redeemable by anyone.
    if key.assigned_email and key.assigned_email.lower() != user.email.lower():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This key is assigned to a different account.",
        )

    # Mark used atomically inside the same transaction
    key.used = True
    key.used_at = datetime.now(timezone.utc).replace(tzinfo=None)
    key.used_by = user.email
    session.add(key)
    await session.commit()

    # Issue single-use 60-second download token
    return await create_download_token(user.id, session)
