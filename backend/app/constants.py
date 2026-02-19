"""
Hardcoded constants — not loaded from env to prevent accidental overrides.
"""

# Emails that are permitted to access admin routes.
# Enforced on BOTH the FastAPI side (dependency) and the Next.js side (SSR guard).
ADMIN_EMAILS: frozenset[str] = frozenset(
    {
        "voyagersvrs135@gmail.com",
        "aleemabeera@gmail.com",
        "sarfarazsaba11@gmail.com",
        "darakhshanimranid@gmail.com",
        "myscienceworld135@gmail.com",
    }
)

# One-time download token lifetime in seconds
DOWNLOAD_TOKEN_TTL: int = 60
