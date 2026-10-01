from collections.abc import Iterator
from functools import lru_cache

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker
from sqlalchemy.pool import NullPool

from .config import get_settings


class Base(DeclarativeBase):
    pass


def normalize_url(url: str) -> str:
    """Supabase gives `postgresql://…`; SQLAlchemy needs the psycopg 3 driver named explicitly."""
    for prefix in ("postgresql://", "postgres://"):
        if url.startswith(prefix):
            return "postgresql+psycopg://" + url[len(prefix) :]
    return url


@lru_cache
def get_engine() -> Engine:
    url = get_settings().database_url
    if not url:
        raise RuntimeError("DATABASE_URL is not set. Add it to .env (locally) or the Vercel project settings.")
    # Serverless functions are short-lived, and Supabase's transaction pooler already pools
    # connections, so don't keep a local pool. The pooler doesn't support prepared statements.
    return create_engine(
        normalize_url(url),
        poolclass=NullPool,
        connect_args={"prepare_threshold": None, "connect_timeout": 10},
    )


def get_session() -> Iterator[Session]:
    session = sessionmaker(bind=get_engine(), expire_on_commit=False)()
    try:
        yield session
    finally:
        session.close()
