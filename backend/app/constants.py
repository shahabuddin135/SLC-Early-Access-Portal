"""
Application constants.
ADMIN_EMAILS is loaded exclusively from the ADMIN_EMAILS env var via settings — not hardcoded here.
"""

# One-time download token lifetime in seconds
DOWNLOAD_TOKEN_TTL: int = 60
