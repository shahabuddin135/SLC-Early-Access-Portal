from typing import Optional

from fastapi import APIRouter, Depends, Query, Request
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.urls import base_url_from_request
from app.dependencies.admin import get_admin_user
from app.dependencies.auth import get_current_user
from app.models.access_request import AccessRequest
from app.models.user import User
from app.services.access_request_service import (
    create_request,
    deny_request,
    grant_request,
    request_stats,
    search_requests,
    suggest_requests,
)

router = APIRouter(prefix="/access-requests", tags=["access-requests"])


# ── Schemas ───────────────────────────────────────────────────────────────────

class RequestOut(BaseModel):
    id: int
    email: str
    name: str
    github_id: str
    status: str
    created_at: str
    decided_at: str | None
    key_id: int | None

    @classmethod
    def from_orm(cls, r: AccessRequest) -> "RequestOut":
        return cls(
            id=r.id,
            email=r.email,
            name=r.name,
            github_id=r.github_id,
            status=r.status,
            created_at=r.created_at.isoformat() if r.created_at else "",
            decided_at=r.decided_at.isoformat() if r.decided_at else None,
            key_id=r.key_id,
        )


class RequestPage(BaseModel):
    items: list[RequestOut]
    total: int
    limit: int
    offset: int
    stats: dict[str, int]


class SuggestionsResponse(BaseModel):
    suggestions: list[str]


class GrantResponse(BaseModel):
    request: RequestOut
    key_value: str
    email_sent: bool


class MineResponse(BaseModel):
    status: str | None


# ── User endpoints ────────────────────────────────────────────────────────────

@router.post("", response_model=RequestOut, status_code=201)
async def request_access(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Create a pending access request. Requires a verified email."""
    req = await create_request(current_user, session)
    return RequestOut.from_orm(req)


# ── Admin endpoints ───────────────────────────────────────────────────────────

@router.get("", response_model=RequestPage)
async def list_requests(
    q: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    _admin: User = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
):
    """Filtered, paginated access requests for the admin smart-search table."""
    items, total = await search_requests(
        session, q=q, status_filter=status, limit=limit, offset=offset
    )
    stats = await request_stats(session)
    return RequestPage(
        items=[RequestOut.from_orm(r) for r in items],
        total=total,
        limit=limit,
        offset=offset,
        stats=stats,
    )


@router.get("/suggestions", response_model=SuggestionsResponse)
async def get_suggestions(
    q: str = Query(default=""),
    _admin: User = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
):
    return SuggestionsResponse(suggestions=await suggest_requests(session, q=q))


@router.post("/{request_id}/grant", response_model=GrantResponse)
async def grant(
    request_id: int,
    request: Request,
    _admin: User = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
):
    req, key, email_sent = await grant_request(
        request_id, session, base_url_from_request(request)
    )
    return GrantResponse(
        request=RequestOut.from_orm(req),
        key_value=key.key_value,
        email_sent=email_sent,
    )


@router.post("/{request_id}/deny", response_model=RequestOut)
async def deny(
    request_id: int,
    _admin: User = Depends(get_admin_user),
    session: AsyncSession = Depends(get_session),
):
    return RequestOut.from_orm(await deny_request(request_id, session))
