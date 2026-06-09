from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.dashboard import DashboardResponse
from app.services.access_request_service import latest_request
from app.services.key_service import get_active_assigned_key

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    req = await latest_request(current_user, session)
    # Surface the user's own active key so the dashboard can reveal/copy it.
    access_key = (
        await get_active_assigned_key(current_user.email, session)
        if req and req.status == "granted"
        else None
    )
    return DashboardResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        github_id=current_user.github_id,
        has_downloaded=current_user.has_downloaded,
        email_verified=current_user.email_verified,
        access_request_status=req.status if req else None,
        access_key=access_key,
    )
