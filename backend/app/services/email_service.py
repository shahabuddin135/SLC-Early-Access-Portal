import asyncio
import logging

import resend

from app.core.config import settings

logger = logging.getLogger(__name__)

_FROM = "SLC Framework <noreply@wewiselabs.com>"

# Featured illustration for email hero
_FEATURED_ILLUSTRATION = "https://res.cloudinary.com/didt1ywys/image/upload/v1781002983/happy_jump_djg2ti.png"


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



def _branded_email(
    *,
    eyebrow: str,
    title_html: str,
    intro_html: str,
    code_value: str | None = None,
    code_caption: str | None = None,
    cta_url: str | None = None,
    cta_label: str | None = None,
    note_html: str | None = None,
) -> str:
    """The shared, warm SLC email card: orange-glow hero with a featured illustration,
    slim light typography, an optional access-key block, CTA."""
    hero = _FEATURED_ILLUSTRATION

    code_block = (
        f"""
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:4px 0 22px;">
                <tr>
                  <td align="center" style="
                    background:
                      radial-gradient(ellipse 90% 120% at 50% 0%, rgba(249,115,22,0.18) 0%, transparent 70%),
                      #0C0C0C;
                    border:1px solid rgba(249,115,22,0.30);
                    border-radius:14px;padding:22px 18px;">
                    <div style="font-size:10.5px;font-weight:600;letter-spacing:0.22em;
                                text-transform:uppercase;color:#7C7C84;margin-bottom:12px;">
                      Your Access Key
                    </div>
                    <div style="font-size:23px;font-weight:600;letter-spacing:0.14em;
                                color:#FB923C;font-family:'SF Mono','Courier New',monospace;
                                word-break:break-all;">
                      {code_value}
                    </div>
                  </td>
                </tr>
              </table>
              <p style="margin:0 0 26px;font-size:12.5px;line-height:1.6;color:#6B7280;text-align:center;">
                {code_caption or "Keep this key private — it's tied to your account."}
              </p>"""
        if code_value
        else ""
    )

    cta_block = (
        f"""
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 30px;">
                <tr>
                  <td align="center" style="
                    border-radius:12px;
                    background:linear-gradient(135deg,#FB923C 0%,#EA580C 100%);
                    box-shadow:0 10px 34px rgba(249,115,22,0.40);">
                    <a href="{cta_url}"
                       style="display:inline-block;padding:15px 38px;
                              font-size:15px;font-weight:600;letter-spacing:0.01em;
                              color:#ffffff;text-decoration:none;">
                      {cta_label} &nbsp;&rarr;
                    </a>
                  </td>
                </tr>
              </table>"""
        if cta_url and cta_label
        else ""
    )

    note_block = (
        f"""
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="
                    background:rgba(249,115,22,0.06);
                    border:1px solid rgba(249,115,22,0.16);
                    border-radius:10px;padding:14px 16px;">
                    <p style="margin:0;font-size:12.5px;line-height:1.65;color:#9CA3AF;">
                      {note_html}
                    </p>
                  </td>
                </tr>
              </table>"""
        if note_html
        else ""
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>SLC Framework</title>
</head>
<body style="margin:0;padding:0;background:#070707;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#070707;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;border-radius:22px;overflow:hidden;
                      box-shadow:0 0 0 1px rgba(255,255,255,0.06), 0 40px 90px rgba(0,0,0,0.75);">

          <!-- ══ HERO ══ -->
          <tr>
            <td align="center" style="
              padding:38px 24px 30px;
              background:
                radial-gradient(circle at 50% 18%, rgba(249,115,22,0.42) 0%, transparent 52%),
                radial-gradient(ellipse 80% 60% at 12% 105%, rgba(124,58,237,0.22) 0%, transparent 60%),
                linear-gradient(160deg, #140a06 0%, #0B0B10 60%, #0A0A0A 100%);">

              <div style="font-size:11px;font-weight:700;letter-spacing:0.30em;
                          text-transform:uppercase;color:rgba(255,255,255,0.42);margin-bottom:22px;">
                WeWise&nbsp;Labs
              </div>

              <!-- featured illustration - large top image -->
              <img src="{hero}" width="180" height="180" alt=""
                   style="display:inline-block;width:180px;height:180px;object-fit:contain;
                          filter:drop-shadow(0 14px 30px rgba(249,115,22,0.45));" />

              <div style="margin-top:18px;">
                <span style="font-size:30px;font-weight:200;letter-spacing:-0.01em;color:#ffffff;">SLC</span>
                <span style="font-size:30px;font-weight:200;letter-spacing:0.01em;color:rgba(255,255,255,0.5);">&nbsp;Framework</span>
              </div>
            </td>
          </tr>

          <!-- ══ CONTENT ══ -->
          <tr>
            <td style="background:#0E0E0E;padding:40px 42px 30px;">
              <p style="margin:0 0 12px;font-size:12px;font-weight:600;letter-spacing:0.16em;
                         text-transform:uppercase;color:#FB923C;">{eyebrow}</p>
              <h1 style="margin:0 0 18px;font-size:29px;font-weight:200;
                          letter-spacing:-0.02em;color:#FFFFFF;line-height:1.25;">{title_html}</h1>
              <p style="margin:0 0 26px;font-size:15.5px;font-weight:300;line-height:1.75;color:#A8AAB3;">{intro_html}</p>
              {code_block}
              {cta_block}
              {note_block}
            </td>
          </tr>

          <!-- ══ FOOTER ══ -->
          <tr>
            <td style="background:#080808;padding:22px 40px 26px;text-align:center;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 16px;">
                <tr><td style="height:3px;border-radius:99px;
                  background:linear-gradient(90deg,#7C3AED,#FB923C,#0EA5E9,#EC4899);"></td></tr>
              </table>
              <p style="margin:0 0 4px;font-size:11.5px;font-weight:600;letter-spacing:0.14em;
                         text-transform:uppercase;color:#3A3A42;">WeWise Labs</p>
              <p style="margin:0;font-size:11px;font-weight:300;color:#3A3A42;letter-spacing:0.02em;">
                Made with love for early builders - please don't reply to this message.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>"""


async def send_password_reset_email(*, email: str, name: str, reset_url: str) -> bool:
    if not settings.resend_enabled:
        return False

    expires_minutes = settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES
    expires_hours = expires_minutes // 60
    subject = "Reset your SLC Framework password"
    text = (
        f"Hi {name},\n\n"
        "We received a request to reset your SLC Framework password.\n"
        f"Use the link below to choose a new password:\n\n{reset_url}\n\n"
        f"This link expires in {expires_hours} hours.\n"
        "If you did not request this change, you can safely ignore this email."
    )
    html = _branded_email(
        eyebrow="Password reset",
        title_html=f"Hey {name}, let's get<br/>you back in.",
        intro_html=(
            "No worries - it happens to all of us. Tap the button below to choose a "
            "fresh password for your <strong style=\"color:#E5E7EB;font-weight:400;\">SLC "
            f"Framework</strong> account. This link is good for <strong style=\"color:#FB923C;font-weight:400;\">{expires_hours} hours</strong>."
        ),
        cta_url=reset_url,
        cta_label="Reset my password",
        note_html=(
            "Didn't ask for this? Your password is still safe and unchanged. You can safely ignore this email."
        ),
    )

    try:
        await asyncio.to_thread(
            _send_via_resend, to=email, subject=subject, html=html, text=text
        )
    except Exception as exc:
        logger.error(
            "Failed to send password reset email to %s — Resend error: %s", email, exc
        )
        return False

    logger.info("Password reset email sent to %s", email)
    return True


async def send_verification_email(*, email: str, name: str, verify_url: str) -> bool:
    if not settings.resend_enabled:
        return False

    expires_minutes = settings.EMAIL_VERIFICATION_TOKEN_EXPIRE_MINUTES
    expires_hours = expires_minutes // 60
    subject = "Welcome! Confirm your email for SLC early access"
    text = (
        f"Hi {name},\n\n"
        "We're so glad you're here. Confirm your email to unlock access requests "
        "for the SLC framework.\n\n"
        f"Verify here:\n{verify_url}\n\n"
        f"This link expires in {expires_hours} hours.\n"
        "If you didn't create an SLC account, you can ignore this email."
    )
    html = _branded_email(
        eyebrow="Welcome aboard",
        title_html=f"So glad you're here,<br/>{name}.",
        intro_html=(
            "You're one tap away from joining the SLC early-access family. Confirm "
            "your email and you'll be able to request your personal download key. "
            f"This link is good for <strong style=\"color:#FB923C;font-weight:400;\">{expires_hours} hours</strong>."
        ),
        cta_url=verify_url,
        cta_label="Confirm my email",
        note_html=(
            "Didn't sign up? No problem. You can safely ignore this email."
        ),
    )

    try:
        await asyncio.to_thread(
            _send_via_resend, to=email, subject=subject, html=html, text=text
        )
    except Exception as exc:
        logger.error("Failed to send verification email to %s — Resend error: %s", email, exc)
        return False

    logger.info("Verification email sent to %s", email)
    return True


async def send_access_key_email(
    *, email: str, name: str, key_value: str, dashboard_url: str
) -> bool:
    if not settings.resend_enabled:
        return False

    subject = "You're in! Your SLC access key is ready"
    text = (
        f"Hi {name},\n\n"
        "Wonderful news - your access request was approved and we're thrilled to have you.\n\n"
        f"Your one-time access key:\n{key_value}\n\n"
        "Open your dashboard to reveal and copy it in one tap, then download the framework:\n"
        f"{dashboard_url}\n\n"
        "This key is tied to your account and can only be redeemed by you."
    )
    html = _branded_email(
        eyebrow="Access granted",
        title_html=f"Welcome to the family,<br/>{name}.",
        intro_html=(
            "We're genuinely happy to have you. Your access request was "
            "<strong style=\"color:#E5E7EB;font-weight:400;\">approved</strong> - here's "
            "your personal one-time key for the SLC language &amp; framework."
        ),
        code_value=key_value,
        code_caption=(
            "Tap the button below to open your dashboard, where you can reveal &amp; "
            "copy this key in one click. It's tied to your account - only you can use it."
        ),
        cta_url=dashboard_url,
        cta_label="Open my dashboard",
        note_html=(
            "A heads-up: SLC is improved every single day during early access, so "
            "you may occasionally need to smooth over a small rough edge while you build. "
            "We're always one message away at wewiselabs@gmail.com. Happy building!"
        ),
    )

    try:
        await asyncio.to_thread(
            _send_via_resend, to=email, subject=subject, html=html, text=text
        )
    except Exception as exc:
        logger.error("Failed to send access key email to %s — Resend error: %s", email, exc)
        return False

    logger.info("Access key email sent to %s", email)
    return True
