import logging
import smtplib
from email.message import EmailMessage

from .config import Settings
from .schemas import ContactIn

log = logging.getLogger(__name__)


def _one_line(value: str) -> str:
    """Header values must not contain line breaks."""
    return " ".join(value.split())


def _notification(data: ContactIn, settings: Settings) -> EmailMessage:
    msg = EmailMessage()
    subject = _one_line(data.subject) or "New message"
    msg["Subject"] = f"[Portfolio] {subject} — from {_one_line(data.name)}"
    msg["From"] = f"Portfolio <{settings.smtp_user}>"
    msg["To"] = settings.contact_to
    # Hitting "Reply" in Gmail answers the visitor directly.
    msg["Reply-To"] = f"{_one_line(data.name)} <{data.email}>"
    msg.set_content(
        f"New message from your portfolio contact form.\n\n"
        f"Name:    {data.name}\n"
        f"Email:   {data.email}\n"
        f"Subject: {data.subject or '—'}\n\n"
        f"{data.message}\n"
    )
    return msg


def _auto_reply(data: ContactIn, settings: Settings) -> EmailMessage:
    msg = EmailMessage()
    msg["Subject"] = "Thanks for your message — Arsen Harutyunyan"
    msg["From"] = f"Arsen Harutyunyan <{settings.smtp_user}>"
    msg["To"] = data.email
    msg.set_content(
        f"Hi {_one_line(data.name)},\n\n"
        f"Thank you for reaching out through my portfolio. I've received your message "
        f"and will get back to you as soon as possible, usually within 1–2 business days.\n\n"
        f"Best regards,\n"
        f"Arsen Harutyunyan\n"
        f"Full Stack Developer · Yerevan, Armenia\n"
        f"GitHub: https://github.com/harutyunyan88\n"
        f"LinkedIn: https://www.linkedin.com/in/harutyunyanpy\n"
    )
    return msg


def send_contact_emails(data: ContactIn, settings: Settings) -> bool:
    """Sends the notification to Arsen and an auto-reply to the visitor. Returns False if sending failed."""
    if not settings.email_enabled:
        log.info("SMTP not configured; skipping email for message from %s", data.email)
        return False
    try:
        with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, timeout=10) as smtp:
            smtp.login(settings.smtp_user, settings.smtp_password)
            smtp.send_message(_notification(data, settings))
            smtp.send_message(_auto_reply(data, settings))
        return True
    except (smtplib.SMTPException, OSError):
        log.exception("Failed to send contact emails")
        return False
