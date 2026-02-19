from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.services.key_service import redeem_key

router = APIRouter(tags=["redeem"])


class RedeemRequest(BaseModel):
    key_value: str


class RedeemResponse(BaseModel):
    download_token: str


@router.post("/redeem", response_model=RedeemResponse)
async def redeem(
    body: RedeemRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    """Exchange a one-time key for a short-lived (60s) download token.
    The key is permanently invalidated on success."""
    token = await redeem_key(body.key_value, current_user, session)
    return RedeemResponse(download_token=token)
