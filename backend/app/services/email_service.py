import asyncio
import logging
from datetime import datetime, timezone
from urllib.parse import urlsplit, urlunsplit

import resend

from app.core.config import settings

logger = logging.getLogger(__name__)

_FROM = "SLC Framework <noreply@wewiselabs.com>"

# Celebration mascot — used for the "access granted" email hero card.
_FEATURED_ILLUSTRATION = "https://res.cloudinary.com/didt1ywys/image/upload/v1781002983/happy_jump_djg2ti.png"
# Mascot carrying files — used for welcome / password-reset hero cards.
_CARRYING_ILLUSTRATION = "https://res.cloudinary.com/didt1ywys/image/upload/v1781002981/carrying_file_nmcdwo.png"

# Brand colours
_ORANGE = "#FF4500"
_ORANGE_SOFT = "#FF6B33"


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


def _hl(text: str) -> str:
    """Inline orange highlight box (matches the on-site headline treatment)."""
    return (
        f'<span style="background:{_ORANGE};color:#ffffff;'
        f'padding:0 0.16em 0.04em;display:inline-block;">{text}</span>'
    )


def _icon_cell(glyph: str, *, size: int = 40) -> str:
    """A small rounded square holding a monochrome orange glyph."""
    return (
        f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>'
        f'<td width="{size}" height="{size}" align="center" valign="middle" '
        f'style="width:{size}px;height:{size}px;background:rgba(255,107,51,0.10);'
        f'border:1px solid rgba(255,107,51,0.22);border-radius:9px;'
        f"font-family:'SF Mono','Courier New',monospace;font-size:16px;font-weight:700;"
        f'line-height:1;color:{_ORANGE_SOFT};">{glyph}</td></tr></table>'
    )


def _branded_email(
    *,
    badge: str,
    title_html: str,
    intro_html: str,
    illustration: str = _CARRYING_ILLUSTRATION,
    cta_url: str | None = None,
    cta_label: str | None = None,
    detail_rows: list[tuple[str, str, str]] | None = None,
    key_value: str | None = None,
    key_caption: str | None = None,
    steps: list[tuple[str, str, str]] | None = None,
    help_title: str | None = None,
    help_text: str | None = None,
    help_cta_label: str | None = None,
    help_cta_url: str | None = None,
    note_html: str | None = None,
    signoff_lead: str = "Let's build the inevitable,",
) -> str:
    """Dark SLC email: header → cream hero card with mascot → dark body
    (access details / get-started / help) → sign-off → footer.

    Built entirely from fixed-width / percentage tables and inline styles so it
    scales down proportionally on mobile instead of stacking into a column.
    Buttons are square-cornered by design."""

    # ── Hero CTA (square button) ───────────────────────────────────────────
    hero_cta = (
        f"""
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 4px;">
                  <tr>
                    <td align="center" bgcolor="{_ORANGE}" style="background:{_ORANGE};">
                      <a href="{cta_url}" style="display:inline-block;padding:13px 26px;
                         font-size:12.5px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;
                         color:#ffffff;text-decoration:none;font-family:'Helvetica Neue',Arial,sans-serif;">
                        {cta_label} &nbsp;&rarr;
                      </a>
                    </td>
                  </tr>
                </table>"""
        if cta_url and cta_label
        else ""
    )

    # ── Access-details strip (two columns, side by side) ───────────────────
    detail_block = ""
    if detail_rows:
        cells = ""
        col_w = 100 // max(len(detail_rows), 1)
        for glyph, label, value in detail_rows:
            cells += f"""
                  <td width="{col_w}%" valign="middle" style="padding:4px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td valign="middle" style="padding-right:12px;">{_icon_cell(glyph)}</td>
                      <td valign="middle">
                        <div style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#7C7C84;">{label}</div>
                        <div style="font-size:14px;font-weight:500;color:#F2F2F4;margin-top:3px;word-break:break-word;">{value}</div>
                      </td>
                    </tr></table>
                  </td>"""
        detail_block = f"""
              <p style="margin:0 0 16px;font-size:11px;font-weight:700;letter-spacing:0.18em;
                        text-transform:uppercase;color:{_ORANGE_SOFT};">Your Access Details</p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
                <tr>{cells}</tr>
              </table>"""

    # ── One-time access key block ──────────────────────────────────────────
    key_block = ""
    if key_value:
        key_block = f"""
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 28px;">
                <tr>
                  <td align="center" style="
                    background:radial-gradient(ellipse 90% 120% at 50% 0%, rgba(255,69,0,0.16) 0%, transparent 70%), #0C0C0C;
                    border:1px solid rgba(255,69,0,0.30);border-radius:12px;padding:20px 18px;">
                    <div style="font-size:10px;font-weight:700;letter-spacing:0.20em;text-transform:uppercase;color:#7C7C84;margin-bottom:11px;">
                      Your Access Key
                    </div>
                    <div style="font-size:22px;font-weight:600;letter-spacing:0.12em;color:{_ORANGE_SOFT};
                                font-family:'SF Mono','Courier New',monospace;word-break:break-all;">
                      {key_value}
                    </div>
                  </td>
                </tr>
              </table>
              <p style="margin:-14px 0 28px;font-size:12px;line-height:1.6;color:#6B7280;text-align:center;">
                {key_caption or "Keep this key private — it's tied to your account."}
              </p>"""

    # ── Get-started grid (three columns, side by side) ─────────────────────
    steps_block = ""
    if steps:
        cells = ""
        col_w = 100 // max(len(steps), 1)
        for i, (glyph, s_title, s_desc) in enumerate(steps):
            border = "border-left:1px solid #1C1C1C;" if i > 0 else ""
            pad = "padding:0 16px;" if i > 0 else "padding:0 16px 0 0;"
            cells += f"""
                  <td width="{col_w}%" valign="top" style="{border}{pad}">
                    {_icon_cell(glyph, size=38)}
                    <div style="font-size:14px;font-weight:600;color:#F2F2F4;margin:14px 0 6px;">{s_title}</div>
                    <div style="font-size:12.5px;line-height:1.55;color:#8A8A93;">{s_desc}</div>
                  </td>"""
        steps_block = f"""
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:6px 0 4px;">
                <tr><td style="border-top:1px solid #1C1C1C;padding-top:26px;">
                  <p style="margin:0 0 20px;font-size:11px;font-weight:700;letter-spacing:0.18em;
                            text-transform:uppercase;color:{_ORANGE_SOFT};">Get Started</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>{cells}</tr>
                  </table>
                </td></tr>
              </table>"""

    # ── Help box ───────────────────────────────────────────────────────────
    help_block = ""
    if help_title:
        help_cta = (
            f"""<a href="{help_cta_url}" style="font-size:11.5px;font-weight:700;letter-spacing:0.10em;
                   text-transform:uppercase;color:{_ORANGE_SOFT};text-decoration:none;white-space:nowrap;">
                   {help_cta_label} &nbsp;&rarr;</a>"""
            if help_cta_label and help_cta_url
            else ""
        )
        help_block = f"""
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 4px;">
                <tr>
                  <td style="background:#141414;border:1px solid #1F1F1F;border-radius:14px;padding:18px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
                      <td width="44" valign="middle" style="padding-right:14px;">
                        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                          <td width="44" height="44" align="center" valign="middle"
                              style="width:44px;height:44px;background:{_ORANGE};border-radius:10px;
                                     font-size:18px;line-height:1;color:#ffffff;">&#10022;</td>
                        </tr></table>
                      </td>
                      <td valign="middle">
                        <div style="font-size:14.5px;font-weight:600;color:#F2F2F4;">{help_title}</div>
                        <div style="font-size:12.5px;line-height:1.5;color:#8A8A93;margin-top:3px;">{help_text or ""}</div>
                      </td>
                      <td valign="middle" align="right" style="padding-left:14px;">{help_cta}</td>
                    </tr></table>
                  </td>
                </tr>
              </table>"""

    # ── Sign-off ───────────────────────────────────────────────────────────
    signoff_block = f"""
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:32px 0 6px;">
                <tr>
                  <td valign="bottom">
                    <div style="font-size:14px;color:#A8AAB3;">{signoff_lead}</div>
                    <div style="font-size:14px;font-weight:600;color:{_ORANGE_SOFT};margin-top:4px;">&mdash; The SLC Team</div>
                  </td>
                  <td valign="bottom" align="right">
                    <span style="font-family:'Segoe Script','Brush Script MT',cursive;font-size:19px;color:{_ORANGE_SOFT};">
                      &#9829; Happy Coding!
                    </span>
                  </td>
                </tr>
              </table>"""

    disclaimer = (
        note_html
        or "This email contains important information about your SLC access. "
        "If you didn't request this, you can safely ignore this email."
    )

    year = datetime.now(timezone.utc).year

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="x-apple-disable-message-reformatting" />
<title>SLC Framework</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A0A;">
    <tr>
      <td align="center" style="padding:30px 14px 44px;">

        <!--[if mso]><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"><tr><td><![endif]-->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

          <!-- ══ HEADER ══ -->
          <tr>
            <td style="padding:6px 6px 20px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="font-family:'SF Mono','Courier New',monospace;font-size:17px;font-weight:700;
                             letter-spacing:0.10em;color:{_ORANGE};">{{&nbsp;S&nbsp;L&nbsp;C&nbsp;}}</td>
                  <td valign="middle" align="right" style="font-size:11.5px;color:#6B6B73;letter-spacing:0.02em;">
                    The world&rsquo;s first spec-native language
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ══ CARD ══ -->
          <tr>
            <td style="background:#0E0E0E;border-radius:22px;overflow:hidden;
                       box-shadow:0 0 0 1px rgba(255,255,255,0.05), 0 40px 90px rgba(0,0,0,0.7);">

              <!-- ── Hero card (cream, mascot on the right) ── -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background:linear-gradient(135deg,#F8E7D6 0%, #F4DCC6 55%, #F1D2B8 100%);">
                <tr>
                  <td width="58%" valign="middle" style="padding:34px 8px 34px 34px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;">
                      <tr><td style="border:1px solid rgba(255,69,0,0.45);border-radius:999px;padding:5px 13px;
                                     font-size:10.5px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:{_ORANGE};">
                        &#10003;&nbsp; {badge}
                      </td></tr>
                    </table>
                    <h1 style="margin:0;font-size:30px;line-height:1.12;font-weight:300;letter-spacing:-0.02em;color:#1A1208;">
                      {title_html}
                    </h1>
                    <p style="margin:14px 0 0;font-size:14px;line-height:1.6;color:#6B5E50;">{intro_html}</p>
                    {hero_cta}
                  </td>
                  <td width="42%" valign="middle" align="center" style="padding:18px 18px 10px 0;">
                    <img src="{illustration}" width="200" alt=""
                         style="display:block;width:100%;max-width:200px;height:auto;
                                filter:drop-shadow(0 16px 28px rgba(180,80,20,0.30));" />
                  </td>
                </tr>
              </table>

              <!-- ── Body ── -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0E0E0E;">
                <tr>
                  <td style="padding:34px 34px 30px;">
                    {detail_block}
                    {key_block}
                    {steps_block}
                    {help_block}
                    {signoff_block}
                  </td>
                </tr>
              </table>

              <!-- ── Footer ── -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0A0A0A;border-top:1px solid #161616;">
                <tr>
                  <td style="padding:24px 34px 8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td valign="top">
                          <div style="font-family:'SF Mono','Courier New',monospace;font-size:14px;font-weight:700;
                                      letter-spacing:0.10em;color:{_ORANGE};">{{&nbsp;S&nbsp;L&nbsp;C&nbsp;}}</div>
                          <div style="font-size:11px;color:#55555E;margin-top:6px;">Spec-native. Token-efficient. Inevitable.</div>
                        </td>
                        <td valign="top" align="right">
                          <div style="font-size:11.5px;color:#6B6B73;">&copy; {year} WeWise Labs</div>
                          <div style="font-size:11.5px;color:#55555E;margin-top:4px;">All rights reserved.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 34px 22px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr><td style="height:1px;background:#161616;line-height:1px;font-size:0;">&nbsp;</td></tr>
                    </table>
                    <p style="margin:16px 0 0;font-size:11px;line-height:1.6;color:#4A4A52;text-align:center;">
                      &#128274;&nbsp; {disclaimer}
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
        <!--[if mso]></td></tr></table><![endif]-->

      </td>
    </tr>
  </table>
</body>
</html>"""


# ── Get-started steps shared by the access-granted email ──────────────────
_GET_STARTED_STEPS = [
    ("&lt;/&gt;", "Read the Spec", "Two files. That's all. SLC reads them first."),
    ("&#8801;", "Write with Clarity", "Maximum signal. Zero ambiguity."),
    ("&#10022;", "Build Effortlessly", "No re-explaining. No drift. Ever."),
]


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
        badge="Password Reset",
        title_html=f"Let&rsquo;s get you<br/>{_hl('back in.')}",
        intro_html=(
            f"No worries, {name} — it happens to all of us. Tap the button below to choose "
            f"a fresh password for your SLC account. This link is good for "
            f"<strong style=\"color:{_ORANGE_SOFT};font-weight:600;\">{expires_hours} hours</strong>."
        ),
        illustration=_CARRYING_ILLUSTRATION,
        cta_url=reset_url,
        cta_label="Reset my password",
        signoff_lead="Stay secure,",
        note_html=(
            "Didn't ask for this? Your password is still safe and unchanged — "
            "you can safely ignore this email."
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
        badge="Verify Email",
        title_html=f"One tap from<br/>{_hl('early access.')}",
        intro_html=(
            f"So glad you&rsquo;re here, {name}. Confirm your email and you&rsquo;ll be able to "
            f"request your personal SLC download key. This link is good for "
            f"<strong style=\"color:{_ORANGE_SOFT};font-weight:600;\">{expires_hours} hours</strong>."
        ),
        illustration=_CARRYING_ILLUSTRATION,
        cta_url=verify_url,
        cta_label="Confirm my email",
        signoff_lead="Welcome aboard,",
        note_html="Didn't sign up? No problem — you can safely ignore this email.",
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

    # Documentation lives at /docs on the same origin as the dashboard.
    origin = urlsplit(dashboard_url)
    docs_url = urlunsplit((origin.scheme, origin.netloc, "/docs", "", ""))

    subject = "You're in! Your SLC access key is ready"
    text = (
        f"Hi {name},\n\n"
        "Wonderful news - your access request was approved and we're thrilled to have you.\n\n"
        f"Your one-time access key:\n{key_value}\n\n"
        "Open your dashboard to reveal and copy it in one tap, then download the framework:\n"
        f"{dashboard_url}\n\n"
        f"New to SLC? Read the docs to get started:\n{docs_url}\n\n"
        "This key is tied to your account and can only be redeemed by you."
    )
    html = _branded_email(
        badge="You're In!",
        title_html=f"You now have<br/>access to {_hl('SLC.')}",
        intro_html=(
            f"Welcome to the future of development, {name}. Your journey with SLC starts now."
        ),
        illustration=_FEATURED_ILLUSTRATION,
        cta_url=dashboard_url,
        cta_label="Access Dashboard",
        detail_rows=[
            ("@", "Email", email),
            ("&#9670;", "Access Type", "Early Access"),
        ],
        key_value=key_value,
        key_caption=(
            "Reveal &amp; copy this key from your dashboard in one click. "
            "It's tied to your account — only you can use it."
        ),
        steps=_GET_STARTED_STEPS,
        help_title="Need help getting started?",
        help_text="Check out our docs or reply to this email.",
        help_cta_label="View Documentation",
        help_cta_url=docs_url,
        signoff_lead="Let's build the inevitable,",
        note_html=(
            "This email contains important information about your SLC access. "
            "If you didn't request access, you can safely ignore this email."
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
