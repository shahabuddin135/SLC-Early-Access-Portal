from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.key import Key
from app.models.review import ReviewSubmission
from app.models.user import User
from app.schemas.review import (
    PublicReview,
    ReviewByKeyRequest,
    ReviewByKeyResponse,
    ReviewRequest,
)


async def _upsert_review(
    user: User,
    project_link: str,
    review_text: str,
    session: AsyncSession,
) -> ReviewSubmission:
    """Create or replace the single review row for a user."""
    result = await session.execute(
        select(ReviewSubmission).where(ReviewSubmission.user_id == user.id)
    )
    existing = result.scalar_one_or_none()

    if existing:
        existing.project_link = project_link
        existing.review_text = review_text
        existing.submitted_at = datetime.utcnow()
        session.add(existing)
        await session.commit()
        await session.refresh(existing)
        return existing

    review = ReviewSubmission(
        user_id=user.id,
        project_link=project_link,
        review_text=review_text,
    )
    session.add(review)
    await session.commit()
    await session.refresh(review)
    return review


async def submit_review(
    data: ReviewRequest,
    user: User,
    session: AsyncSession,
) -> ReviewSubmission:
    if not user.has_downloaded:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You must download the SLC files before submitting a review",
        )

    return await _upsert_review(
        user=user,
        project_link=str(data.project_link),
        review_text=data.review_text,
        session=session,
    )


async def submit_review_by_key(
    data: ReviewByKeyRequest,
    session: AsyncSession,
) -> ReviewByKeyResponse:
    """Submit a review without logging in. The download key proves the author is a
    real SLC user; their profile (name) is resolved from the key, so they cannot
    review as anyone else."""
    key_result = await session.execute(
        select(Key).where(Key.key_value == data.key_value)
    )
    key = key_result.scalar_one_or_none()
    if key is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="We could not find that download key.",
        )

    # A redeemed key records used_by; an assigned key carries assigned_email.
    email = key.used_by or key.assigned_email
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="That key has not been used to download SLC yet.",
        )

    user_result = await session.execute(
        select(User).where(func.lower(User.email) == email.lower())
    )
    user = user_result.scalar_one_or_none()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No account is linked to that download key.",
        )

    review = await _upsert_review(
        user=user,
        project_link=str(data.project_link),
        review_text=data.review_text,
        session=session,
    )
    return ReviewByKeyResponse(
        name=user.name,
        review_text=review.review_text,
        submitted_at=review.submitted_at,
    )


async def list_public_reviews(
    session: AsyncSession,
    limit: int = 100,
) -> list[PublicReview]:
    """All submitted reviews joined with their author's name, newest first."""
    result = await session.execute(
        select(ReviewSubmission, User)
        .join(User, User.id == ReviewSubmission.user_id)
        .order_by(ReviewSubmission.submitted_at.desc())
        .limit(limit)
    )
    return [
        PublicReview(
            id=review.id,
            name=user.name,
            github_id=user.github_id,
            project_link=review.project_link,
            review_text=review.review_text,
            submitted_at=review.submitted_at,
        )
        for review, user in result.all()
    ]
