from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_session
from app.dependencies.admin import get_admin_user
from app.models.key import Key
from app.models.user import User
from app.services.key_service import generate_keys, list_keys

router = APIRouter(prefix="/admin", tags=["admin"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class KeyOut(BaseModel):
    id: int
    key_value: str
    used: bool
    created_at: str
    used_at: str | None
    used_by: str | None

    @classmethod
    def from_orm(cls, k: Key) -> "KeyOut":
        return cls(
            id=k.id,
            key_value=k.key_value,
            used=k.used,
            created_at=k.created_at.isoformat() if k.created_at else "",
            used_at=k.used_at.isoformat() if k.used_at else None,
            used_by=k.used_by,
        )


class KeysResponse(BaseModel):
    keys: list[KeyOut]
    total: int
    used: int
    unused: int


class GenerateRequest(BaseModel):
    count: int = Field(..., ge=1, le=100, description="Number of keys to generate (1-100)")


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/keys", response_model=KeysResponse)
async def get_keys(
    _admin: User = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
):
    """List all keys with stats. Admin-only."""
    keys = await list_keys(session)
    key_outs = [KeyOut.from_orm(k) for k in keys]
    used_count = sum(1 for k in keys if k.used)
    return KeysResponse(
        keys=key_outs,
        total=len(keys),
        used=used_count,
        unused=len(keys) - used_count,
    )


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
