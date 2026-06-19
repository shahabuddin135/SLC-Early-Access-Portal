from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.review import (
    PublicReview,
    ReviewByKeyRequest,
    ReviewByKeyResponse,
    ReviewRequest,
    ReviewResponse,
)
from app.services.review_service import (
    list_public_reviews,
    submit_review,
    submit_review_by_key,
)

router = APIRouter(tags=["review"])


@router.get("/reviews", response_model=list[PublicReview])
async def get_reviews(session: AsyncSession = Depends(get_session)):
    """Public — powers the Builder Archive on the landing page."""
    return await list_public_reviews(session=session)


@router.post("/reviews/by-key", response_model=ReviewByKeyResponse, status_code=201)
async def create_review_by_key(
    data: ReviewByKeyRequest,
    session: AsyncSession = Depends(get_session),
):
    """Public — submit a review using a download key instead of logging in."""
    return await submit_review_by_key(data=data, session=session)


@router.post("/review", response_model=ReviewResponse, status_code=201)
async def create_review(
    data: ReviewRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
):
    result = await submit_review(data=data, user=current_user, session=session)
    return ReviewResponse(
        id=result.id,
        user_id=result.user_id,
        project_link=result.project_link,
        review_text=result.review_text,
        submitted_at=result.submitted_at,
    )
