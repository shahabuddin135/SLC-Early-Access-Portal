from fastapi import APIRouter, Depends

from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.dashboard import DashboardResponse

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(current_user: User = Depends(get_current_user)):
    return DashboardResponse(
        id=current_user.id,
        name=current_user.name,
        email=current_user.email,
        github_id=current_user.github_id,
        has_downloaded=current_user.has_downloaded,
    )
