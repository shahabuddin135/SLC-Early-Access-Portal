from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.review import ReviewSubmission
from app.models.user import User
from app.schemas.review import PublicReview, ReviewRequest


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
    # The account is the identity: reviews are filed under the signed-in user's
    # name, and a verified address is what keeps throwaway accounts out.
    if not user.email_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Verify your email address before submitting a review",
        )

    return await _upsert_review(
        user=user,
        project_link=str(data.project_link),
        review_text=data.review_text,
        session=session,
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
