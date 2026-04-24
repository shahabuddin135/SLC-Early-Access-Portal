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


def _build_reset_html(name: str, reset_url: str, expires: int) -> str:
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Reset your SLC Framework password</title>
</head>
<body style="margin:0;padding:0;background:#0A0A0A;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- ░░ Outer wrapper ░░ -->
  <table width="100%" cellpadding="0" cellspacing="0" border="0"
         style="background:#0A0A0A;min-height:100vh;">
    <tr>
      <td align="center" style="padding:48px 16px;">

        <!-- ░░ Card ░░ -->
        <table width="100%" cellpadding="0" cellspacing="0" border="0"
               style="max-width:540px;border-radius:16px;overflow:hidden;
                      box-shadow:0 0 0 1px rgba(255,255,255,0.08),
                                 0 32px 80px rgba(0,0,0,0.7);">

          <!-- ══ ABSTRACT HERO ══ -->
          <tr>
            <td style="
              padding:0;
              background:
                radial-gradient(ellipse 80% 60% at 10% 110%, #7C3AED 0%, transparent 55%),
                radial-gradient(ellipse 70% 50% at 90% -10%, #F97316 0%, transparent 55%),
                radial-gradient(ellipse 60% 80% at 50% 50%, #0EA5E9 0%, transparent 65%),
                radial-gradient(ellipse 55% 40% at 80% 90%, #EC4899 0%, transparent 50%),
                linear-gradient(135deg, #0F0414 0%, #0A1628 50%, #0F0414 100%);
              position:relative;
              height:220px;
              text-align:center;">

              <!-- Floating orbs via inline bordered divs (table-safe fallback) -->
              <div style="position:absolute;top:20px;left:30px;
                          width:80px;height:80px;border-radius:50%;
                          background:radial-gradient(circle,rgba(249,115,22,0.35),transparent 70%);
                          filter:blur(12px);"></div>
              <div style="position:absolute;bottom:10px;right:20px;
                          width:120px;height:120px;border-radius:50%;
                          background:radial-gradient(circle,rgba(124,58,237,0.4),transparent 70%);
                          filter:blur(18px);"></div>
              <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);
                          width:160px;height:60px;border-radius:50%;
                          background:radial-gradient(circle,rgba(14,165,233,0.25),transparent 70%);
                          filter:blur(20px);"></div>

              <!-- Logo / wordmark -->
              <div style="position:absolute;top:50%;left:50%;
                          transform:translate(-50%,-50%);
                          text-align:center;">
                <div style="display:inline-block;
                             background:rgba(255,255,255,0.06);
                             border:1px solid rgba(255,255,255,0.12);
                             border-radius:12px;padding:10px 22px;
                             backdrop-filter:blur(8px);">
                  <span style="font-size:13px;font-weight:800;letter-spacing:0.18em;
                                text-transform:uppercase;color:rgba(255,255,255,0.5);">
                    WeWise Labs
                  </span>
                </div>
                <div style="margin-top:14px;">
                  <span style="font-size:36px;font-weight:900;letter-spacing:-0.03em;
                                color:#fff;text-shadow:0 0 40px rgba(249,115,22,0.6);">
                    SLC
                  </span>
                  <span style="font-size:36px;font-weight:300;letter-spacing:-0.01em;
                                color:rgba(255,255,255,0.55);">
                    &nbsp;Framework
                  </span>
                </div>
              </div>
            </td>
          </tr>

          <!-- ══ CONTENT ══ -->
          <tr>
            <td style="background:#111111;padding:44px 40px 36px;">

              <!-- Greeting -->
              <p style="margin:0 0 8px;font-size:13px;font-weight:600;
                         letter-spacing:0.1em;text-transform:uppercase;
                         color:#F97316;">
                Password Reset
              </p>
              <h1 style="margin:0 0 20px;font-size:26px;font-weight:800;
                          letter-spacing:-0.03em;color:#FFFFFF;line-height:1.25;">
                Hey {name}, let&rsquo;s get<br/>you back in.
              </h1>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#9CA3AF;">
                We received a request to reset the password for your
                <strong style="color:#E5E7EB;">SLC Framework</strong> account.
                Click the button below &mdash; the link expires in
                <strong style="color:#F97316;">{expires}&nbsp;minutes</strong>.
              </p>

              <!-- CTA button -->
              <table cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 32px;">
                <tr>
                  <td align="center" style="
                    border-radius:10px;
                    background:linear-gradient(135deg,#F97316 0%,#EA580C 100%);
                    box-shadow:0 8px 32px rgba(249,115,22,0.45);">
                    <a href="{reset_url}"
                       style="display:inline-block;padding:16px 40px;
                              font-size:15px;font-weight:700;letter-spacing:0.02em;
                              color:#ffffff;text-decoration:none;">
                      Reset Password &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="margin:0 0 28px;">
                <tr>
                  <td style="height:1px;
                    background:linear-gradient(90deg,transparent,#222,transparent);"></td>
                </tr>
              </table>

              <!-- Fallback link -->
              <p style="margin:0 0 6px;font-size:12px;color:#6B7280;">
                If the button doesn&rsquo;t work, copy and paste this URL:
              </p>
              <p style="margin:0 0 28px;font-size:11px;word-break:break-all;
                         color:#4B5563;font-family:'Courier New',monospace;">
                {reset_url}
              </p>

              <!-- Didn't request notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="
                    background:rgba(249,115,22,0.06);
                    border:1px solid rgba(249,115,22,0.15);
                    border-radius:8px;padding:14px 16px;">
                    <p style="margin:0;font-size:12.5px;line-height:1.6;color:#9CA3AF;">
                      &#x26A0;&#xFE0F;&ensp;Didn&rsquo;t request this?
                      Your password has <strong style="color:#E5E7EB;">not</strong> been changed.
                      You can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ══ FOOTER ══ -->
          <tr>
            <td style="
              background:#0D0D0D;
              border-top:1px solid #1A1A1A;
              padding:24px 40px;
              text-align:center;">

              <!-- Abstract footer bar -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="margin:0 auto 18px;">
                <tr>
                  <td style="height:3px;border-radius:99px;
                    background:linear-gradient(90deg,#7C3AED,#F97316,#0EA5E9,#EC4899);"></td>
                </tr>
              </table>

              <p style="margin:0 0 4px;font-size:12px;font-weight:700;
                         letter-spacing:0.12em;text-transform:uppercase;color:#374151;">
                WeWise Labs
              </p>
              <p style="margin:0;font-size:11px;color:#374151;letter-spacing:0.02em;">
                This is an automated message &mdash; please do not reply.
              </p>
            </td>
          </tr>

        </table>
        <!-- /card -->

      </td>
    </tr>
  </table>

</body>
</html>"""


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
    html = _build_reset_html(name=name, reset_url=reset_url, expires=expires)

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