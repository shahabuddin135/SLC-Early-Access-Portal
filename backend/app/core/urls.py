"""Resolve the public base URL for links we email out (verification, password
reset, dashboard). The frontend forwards the origin a user is actually on via the
`X-App-Base-Url` header so links auto-adapt to any deployment (production, Vercel
preview, custom domain) with no manual config. We validate it against an allowlist
to prevent host-header injection / phishing links in emails."""
import logging
from urllib.parse import urlparse

from fastapi import Request

from app.core.config import settings

logger = logging.getLogger(__name__)

BASE_URL_HEADER = "x-app-base-url"


def _allowed_hosts() -> set[str]:
    hosts: set[str] = {"localhost", "127.0.0.1"}
    # Only add FRONTEND_URL host if it's explicitly configured
    if settings.FRONTEND_URL:
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
    """Return a trusted base URL (no trailing slash). 
    
    Priority:
    1. Use candidate (from X-App-Base-Url header) if valid and allowlisted
    2. Fall back to FRONTEND_URL if explicitly configured
    3. Fall back to http://localhost:3000 for development only
    
    In production, always rely on the header or FRONTEND_URL env var.
    """
    # Try to use the candidate from the header first
    if candidate:
        try:
            p = urlparse(candidate.strip())
        except Exception:
            pass
        else:
            if p.scheme in ("http", "https") and p.netloc and p.hostname:
                if _is_allowed(p.hostname):
                    return f"{p.scheme}://{p.netloc}".rstrip("/")
    
    # Fall back to configured FRONTEND_URL if set
    if settings.FRONTEND_URL:
        return settings.FRONTEND_URL.rstrip("/")
    
    # Last resort: development fallback
    if settings.ENVIRONMENT == "development":
        return "http://localhost:3000"
    
    # Production without proper config — log warning but fall back to localhost
    # This indicates a configuration issue that should be fixed
    logger.warning(
        "Could not determine frontend base URL from header or FRONTEND_URL env var. "
        "Email links may not work correctly in production. "
        "Ensure X-App-Base-Url header is being sent by frontend or set FRONTEND_URL env var."
    )
    return "http://localhost:3000"


def base_url_from_request(request: Request) -> str:
    """Convenience: resolve from the X-App-Base-Url header on an incoming request."""
    return resolve_base_url(request.headers.get(BASE_URL_HEADER))
