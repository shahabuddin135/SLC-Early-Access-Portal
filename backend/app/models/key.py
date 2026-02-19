from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class Key(SQLModel, table=True):
    __tablename__ = "keys"

    id: Optional[int] = Field(default=None, primary_key=True)
    key_value: str = Field(max_length=19, unique=True, index=True)
    used: bool = Field(default=False)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc).replace(tzinfo=None)
    )
    used_at: Optional[datetime] = Field(default=None)
    used_by: Optional[str] = Field(default=None, max_length=255)
