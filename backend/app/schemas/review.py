from datetime import datetime

from pydantic import AnyHttpUrl, BaseModel, field_validator


class ReviewRequest(BaseModel):
    project_link: AnyHttpUrl
    review_text: str

    @field_validator("review_text")
    @classmethod
    def review_text_min_length(cls, v: str) -> str:
        if len(v.strip()) < 10:
            raise ValueError("Review text must be at least 10 characters")
        if len(v) > 2000:
            raise ValueError("Review text must not exceed 2000 characters")
        return v


class ReviewByKeyRequest(BaseModel):
    """Submit a review without logging in — the download key identifies the user."""

    key_value: str
    project_link: AnyHttpUrl
    review_text: str

    @field_validator("key_value")
    @classmethod
    def key_value_present(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Download key is required")
        return v.strip()

    @field_validator("review_text")
    @classmethod
    def review_text_min_length(cls, v: str) -> str:
        if len(v.strip()) < 10:
            raise ValueError("Review text must be at least 10 characters")
        if len(v) > 2000:
            raise ValueError("Review text must not exceed 2000 characters")
        return v


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    project_link: str
    review_text: str
    submitted_at: datetime


class ReviewByKeyResponse(BaseModel):
    name: str
    review_text: str
    submitted_at: datetime


class PublicReview(BaseModel):
    """A review as shown publicly on the landing page (Builder Archive)."""

    id: int
    name: str
    github_id: str
    project_link: str
    review_text: str
    submitted_at: datetime
