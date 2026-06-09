from typing import Optional

from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_session
from app.dependencies.admin import get_admin_user
from app.models.key import Key
from app.models.user import User
from app.services.key_service import (
    generate_keys,
    key_stats,
    search_keys,
    suggest_keys,
)

router = APIRouter(prefix="/admin", tags=["admin"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class KeyOut(BaseModel):
    id: int
    key_value: str
    used: bool
    created_at: str
    used_at: str | None
    used_by: str | None
    assigned_email: str | None

    @classmethod
    def from_orm(cls, k: Key) -> "KeyOut":
        return cls(
            id=k.id,
            key_value=k.key_value,
            used=k.used,
            created_at=k.created_at.isoformat() if k.created_at else "",
            used_at=k.used_at.isoformat() if k.used_at else None,
            used_by=k.used_by,
            assigned_email=k.assigned_email,
        )


class KeysResponse(BaseModel):
    keys: list[KeyOut]
    total: int
    used: int
    unused: int


class SuggestionsResponse(BaseModel):
    suggestions: list[str]


class GenerateRequest(BaseModel):
    count: int = Field(..., ge=1, le=100, description="Number of keys to generate (1-100)")


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/keys", response_model=KeysResponse)
async def get_keys(
    q: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    _admin: User = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
):
    """Filtered, paginated keys with global stats. Admin-only.

    `total`/`used`/`unused` reflect the whole table (for the stat cards), while
    `keys` is the current filtered page (for the lazy-loaded table)."""
    page, _filtered_total = await search_keys(
        session, q=q, status_filter=status, limit=limit, offset=offset
    )
    stats = await key_stats(session)
    return KeysResponse(
        keys=[KeyOut.from_orm(k) for k in page],
        total=stats["total"],
        used=stats["used"],
        unused=stats["unused"],
    )


@router.get("/keys/suggestions", response_model=SuggestionsResponse)
async def get_key_suggestions(
    q: str = Query(default=""),
    _admin: User = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
):
    return SuggestionsResponse(suggestions=await suggest_keys(session, q=q))


@router.post("/keys/generate", response_model=list[KeyOut], status_code=201)
async def create_keys(
    body: GenerateRequest,
    _admin: User = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
):
    """Generate 1–100 new one-time keys. Admin-only."""
    keys = await generate_keys(body.count, session)
    return [KeyOut.from_orm(k) for k in keys]


@router.get("/who")
async def who_are_admins(_admin: User = Depends(get_admin_user)):
    """Dev helper — returns the list of admin emails (still admin-gated)."""
    return {"admin_emails": sorted(settings.admin_emails_set)}
