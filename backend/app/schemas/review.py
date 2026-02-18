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


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    project_link: str
    review_text: str
    submitted_at: datetime
