import asyncio
import logging

import resend

from app.core.config import settings

logger = logging.getLogger(__name__)

_FROM = "SLC Framework <noreply@wewiselabs.com>"


def _send_via_resend(*, to: str, subject: str, html: str, text: str) -> None:
    resend.api_key = settings.RESEND_API_KEY
    resend.Emails.send(
        {
            "from": _FROM,
            "to": [to],
            "subject": subject,
            "html": html,
            "text": text,
        }
    )


async def send_password_reset_email(*, email: str, name: str, reset_url: str) -> bool:
    if not settings.resend_enabled:
        return False

    expires = settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
    subject = "Reset your SLC Framework password"
    text = (
        f"Hi {name},\n\n"
        "We received a request to reset your SLC Framework password.\n"
        f"Use the link below to choose a new password:\n\n{reset_url}\n\n"
        f"This link expires in {expires} minutes.\n"
        "If you did not request this change, you can safely ignore this email."
    )
    html = (
        "<!DOCTYPE html><html><body style='font-family:sans-serif;color:#111;'>"
        f"<p>Hi {name},</p>"
        "<p>We received a request to reset your <strong>SLC Framework</strong> password.</p>"
        f"<p><a href='{reset_url}' style='background:#F97316;color:#fff;padding:10px 20px;"
        "text-decoration:none;border-radius:4px;font-weight:600;display:inline-block;"
        f"'>Reset password</a></p>"
        f"<p style='color:#6B7280;font-size:0.875rem;'>This link expires in {expires} minutes. "
        "If you didn't request this, you can ignore this email.</p>"
        "</body></html>"
    )

    try:
        await asyncio.to_thread(
            _send_via_resend, to=email, subject=subject, html=html, text=text
        )
    except Exception as exc:
        logger.error(
            "Failed to send password reset email to %s — Resend error: %s",
            email,
            exc,
        )
        return False

    logger.info("Password reset email sent to %s", email)
    return True