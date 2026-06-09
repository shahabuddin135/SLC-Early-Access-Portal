from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy import func, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.access_request import AccessRequest
from app.models.key import Key
from app.models.user import User
from app.services.email_service import send_access_key_email
from app.services.key_service import generate_assigned_key

VALID_STATUSES = ("pending", "granted", "denied")


def _now() -> datetime:
    return datetime.now(timezone.utc).replace(tzinfo=None)


async def create_request(user: User, session: AsyncSession) -> AccessRequest:
    """Create a pending access request for a verified user. One pending request
    at a time."""
    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before requesting access.",
        )

    existing = await session.execute(
        select(AccessRequest).where(
            AccessRequest.user_id == user.id,
            AccessRequest.status == "pending",
        )
    )
    if existing.scalar_one_or_none() is not None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="You already have a pending access request.",
        )

    req = AccessRequest(
        user_id=user.id,
        email=user.email,
        name=user.name,
        github_id=user.github_id,
    )
    session.add(req)
    await session.commit()
    await session.refresh(req)
    return req


async def latest_request(user: User, session: AsyncSession) -> Optional[AccessRequest]:
    result = await session.execute(
        select(AccessRequest)
        .where(AccessRequest.user_id == user.id)
        .order_by(AccessRequest.created_at.desc())
        .limit(1)
    )
    return result.scalar_one_or_none()


def _apply_filters(stmt, q: Optional[str], status_filter: Optional[str]):
    if q:
        like = f"%{q.strip()}%"
        stmt = stmt.where(
            or_(
                AccessRequest.name.ilike(like),
                AccessRequest.email.ilike(like),
                AccessRequest.github_id.ilike(like),
            )
        )
    if status_filter and status_filter in VALID_STATUSES:
        stmt = stmt.where(AccessRequest.status == status_filter)
    return stmt


async def search_requests(
    session: AsyncSession,
    *,
    q: Optional[str] = None,
    status_filter: Optional[str] = None,
    limit: int = 20,
    offset: int = 0,
) -> tuple[list[AccessRequest], int]:
    """Filtered + paginated list for the admin smart-search table."""
    base = _apply_filters(select(AccessRequest), q, status_filter)

    total_result = await session.execute(
        _apply_filters(select(func.count(AccessRequest.id)), q, status_filter)
    )
    total = int(total_result.scalar_one())

    rows = await session.execute(
        base.order_by(AccessRequest.created_at.desc()).offset(offset).limit(limit)
    )
    return list(rows.scalars().all()), total


async def suggest_requests(
    session: AsyncSession, *, q: str, limit: int = 5
) -> list[str]:
    """Distinct email matches for the autocomplete dropdown."""
    if not q or not q.strip():
        return []
    like = f"%{q.strip()}%"
    result = await session.execute(
        select(AccessRequest.email)
        .where(
            or_(
                AccessRequest.email.ilike(like),
                AccessRequest.name.ilike(like),
                AccessRequest.github_id.ilike(like),
            )
        )
        .distinct()
        .order_by(AccessRequest.email)
        .limit(limit)
    )
    return [row for row in result.scalars().all()]


async def request_stats(session: AsyncSession) -> dict[str, int]:
    result = await session.execute(
        select(AccessRequest.status, func.count(AccessRequest.id)).group_by(
            AccessRequest.status
        )
    )
    counts = {s: 0 for s in VALID_STATUSES}
    for st, n in result.all():
        counts[st] = int(n)
    counts["total"] = sum(counts[s] for s in VALID_STATUSES)
    return counts


async def grant_request(
    request_id: int, session: AsyncSession, base_url: str
) -> tuple[AccessRequest, Key, bool]:
    """Approve a pending request: mint a key bound to the requester, record it,
    and email the key. Returns (request, key, email_sent)."""
    result = await session.execute(
        select(AccessRequest).where(AccessRequest.id == request_id).with_for_update()
    )
    req = result.scalar_one_or_none()
    if req is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found.")
    if req.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Request already {req.status}.",
        )

    key = await generate_assigned_key(req.email, session)

    req.status = "granted"
    req.key_id = key.id
    req.decided_at = _now()
    session.add(req)
    await session.commit()
    await session.refresh(req)

    dashboard_url = f"{base_url.rstrip('/')}/dashboard"
    email_sent = await send_access_key_email(
        email=req.email,
        name=req.name,
        key_value=key.key_value,
        dashboard_url=dashboard_url,
    )
    return req, key, email_sent


async def deny_request(request_id: int, session: AsyncSession) -> AccessRequest:
    result = await session.execute(
        select(AccessRequest).where(AccessRequest.id == request_id).with_for_update()
    )
    req = result.scalar_one_or_none()
    if req is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Request not found.")
    if req.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Request already {req.status}.",
        )

    req.status = "denied"
    req.decided_at = _now()
    session.add(req)
    await session.commit()
    await session.refresh(req)
    return req
