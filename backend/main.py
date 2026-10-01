import hashlib
import logging
from datetime import datetime, timedelta, timezone
from typing import Annotated

from fastapi import Depends, FastAPI, HTTPException, Request, Response
from sqlalchemy import func, select, text
from sqlalchemy.orm import Session

from .config import Settings, get_settings
from .cv import Lang, build_cv
from .db import get_session
from .mailer import send_contact_emails
from .models import ContactMessage
from .schemas import ContactIn, ContactOut

logging.basicConfig(level=logging.INFO)

app = FastAPI(title="Arsen Harutyunyan — Portfolio API", docs_url="/api/docs", openapi_url="/api/openapi.json")

SessionDep = Annotated[Session, Depends(get_session)]
SettingsDep = Annotated[Settings, Depends(get_settings)]


def client_ip_hash(request: Request, salt: str) -> str:
    # Vercel puts the visitor's IP first in X-Forwarded-For.
    forwarded = request.headers.get("x-forwarded-for", "")
    ip = forwarded.split(",")[0].strip() or (request.client.host if request.client else "unknown")
    return hashlib.sha256(f"{salt}:{ip}".encode()).hexdigest()


@app.get("/api/health")
def health(session: SessionDep) -> dict[str, str]:
    """Also called daily by a Vercel cron job so the free Supabase project isn't paused for inactivity."""
    session.execute(text("select 1"))
    return {"status": "ok"}


@app.get("/api/cv", response_class=Response, responses={200: {"content": {"application/pdf": {}}}})
def cv(lang: Lang = "en", download: bool = True) -> Response:
    """The CV as a PDF, built from the website's content in the requested language."""

    disposition = "attachment" if download else "inline"
    return Response(
        build_cv(lang),
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'{disposition}; filename="Arsen_Harutyunyan_CV_{lang.upper()}.pdf"',
            # Vercel's CDN keeps a copy for a day; every new deployment clears it.
            "Cache-Control": "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800",
        },
    )


@app.post("/api/contact", response_model=ContactOut)
def contact(data: ContactIn, request: Request, session: SessionDep, settings: SettingsDep) -> ContactOut:
    # Pretend success to bots so they don't learn about the honeypot.
    if data.website:
        return ContactOut()

    ip_hash = client_ip_hash(request, settings.ip_hash_salt)
    hour_ago = datetime.now(timezone.utc) - timedelta(hours=1)
    recent = session.scalar(
        select(func.count())
        .select_from(ContactMessage)
        .where(ContactMessage.ip_hash == ip_hash, ContactMessage.created_at >= hour_ago)
    )
    if recent and recent >= settings.rate_limit_per_hour:
        raise HTTPException(status_code=429, detail="Too many messages. Please try again later.")

    message = ContactMessage(
        name=data.name,
        email=str(data.email),
        subject=data.subject,
        message=data.message,
        ip_hash=ip_hash,
        user_agent=request.headers.get("user-agent", "")[:300],
    )
    session.add(message)
    session.commit()

    # The message is already saved, so a mail failure doesn't fail the request.
    if send_contact_emails(data, settings):
        message.email_sent = True
        session.commit()

    return ContactOut()
