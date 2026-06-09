"""Resolve the public base URL for links we email out (verification, password
reset, dashboard). The frontend forwards the origin a user is actually on via the
`X-App-Base-Url` header so links auto-adapt to any deployment (production, Vercel
preview, custom domain) with no manual config. We validate it against an allowlist
to prevent host-header injection / phishing links in emails."""
from urllib.parse import urlparse

from fastapi import Request

from app.core.config import settings

BASE_URL_HEADER = "x-app-base-url"


def _allowed_hosts() -> set[str]:
    hosts: set[str] = {"localhost", "127.0.0.1"}
    fe = urlparse(settings.FRONTEND_URL).hostname
    if fe:
        hosts.add(fe.lower())
    for h in settings.ALLOWED_REDIRECT_HOSTS.split(","):
        h = h.strip().lower()
        if h:
            hosts.add(h)
    return hosts


def _is_allowed(host: str) -> bool:
    host = host.lower()
    # Vercel preview/prod deployments share the *.vercel.app suffix.
    if host.endswith(".vercel.app"):
        return True
    return host in _allowed_hosts()


def resolve_base_url(candidate: str | None) -> str:
    """Return a trusted base URL (no trailing slash). Falls back to FRONTEND_URL
    when the candidate is missing or not allowlisted."""
    fallback = settings.FRONTEND_URL.rstrip("/")
    if not candidate:
        return fallback
    try:
        p = urlparse(candidate.strip())
    except Exception:
        return fallback
    if p.scheme not in ("http", "https") or not p.netloc or not p.hostname:
        return fallback
    if not _is_allowed(p.hostname):
        return fallback
    return f"{p.scheme}://{p.netloc}".rstrip("/")


def base_url_from_request(request: Request) -> str:
    """Convenience: resolve from the X-App-Base-Url header on an incoming request."""
    return resolve_base_url(request.headers.get(BASE_URL_HEADER))
