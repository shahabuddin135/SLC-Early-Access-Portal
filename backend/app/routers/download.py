from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.limiter import limiter
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.dashboard import DownloadResponse
from app.services.download_service import record_download

router = APIRouter(tags=["download"])


@router.get("/download", response_model=DownloadResponse)
@limiter.limit("10/minute")
async def trigger_download(
    request: Request,
    key: str = Query(..., description="Download key"),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    ip = request.client.host if request.client else None
    await record_download(session=session, user=current_user, ip=ip, key=key)
    return DownloadResponse(has_downloaded=True)
