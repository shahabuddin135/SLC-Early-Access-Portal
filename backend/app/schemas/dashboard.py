from pydantic import BaseModel


class DashboardResponse(BaseModel):
    id: int
    name: str
    email: str
    github_id: str
    has_downloaded: bool
    email_verified: bool
    access_request_status: str | None = None
    access_key: str | None = None


class DownloadResponse(BaseModel):
    has_downloaded: bool
