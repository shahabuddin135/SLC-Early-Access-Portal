from pydantic import BaseModel


class DashboardResponse(BaseModel):
    id: int
    name: str
    email: str
    github_id: str
    has_downloaded: bool
    has_agreed_terms: bool


class DownloadResponse(BaseModel):
    has_downloaded: bool
