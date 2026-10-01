from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from backend import main
from backend.config import Settings, get_settings
from backend.db import Base, get_session
from backend.models import ContactMessage

VALID = {
    "name": "Jane Recruiter",
    "email": "jane@example.com",
    "subject": "Frontend role",
    "message": "Hi Arsen, we'd love to talk about a role.",
    "website": "",
}


@pytest.fixture
def session_factory() -> sessionmaker[Session]:
    engine = create_engine("sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool)
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine, expire_on_commit=False)


@pytest.fixture
def sent_emails(monkeypatch: pytest.MonkeyPatch) -> list[str]:
    sent: list[str] = []

    def fake_send(data, settings) -> bool:
        sent.append(data.email)
        return True

    monkeypatch.setattr(main, "send_contact_emails", fake_send)
    return sent


@pytest.fixture
def client(session_factory: sessionmaker[Session], sent_emails: list[str]) -> Iterator[TestClient]:
    def override_session() -> Iterator[Session]:
        with session_factory() as session:
            yield session

    main.app.dependency_overrides[get_session] = override_session
    main.app.dependency_overrides[get_settings] = lambda: Settings(
        _env_file=None, database_url="sqlite://", rate_limit_per_hour=2
    )
    yield TestClient(main.app)
    main.app.dependency_overrides.clear()


def saved(session_factory: sessionmaker[Session]) -> list[ContactMessage]:
    with session_factory() as session:
        return list(session.scalars(select(ContactMessage)))


def test_health(client: TestClient) -> None:
    assert client.get("/api/health").json() == {"status": "ok"}


def test_valid_message_is_saved_and_emailed(client, session_factory, sent_emails) -> None:
    res = client.post("/api/contact", json=VALID)

    assert res.status_code == 200
    [message] = saved(session_factory)
    assert message.name == "Jane Recruiter"
    assert message.email_sent is True
    assert len(message.ip_hash) == 64  # hashed, never the raw IP
    assert sent_emails == ["jane@example.com"]


def test_whitespace_is_trimmed(client, session_factory) -> None:
    client.post("/api/contact", json={**VALID, "name": "  Jane  "})
    assert saved(session_factory)[0].name == "Jane"


def test_honeypot_pretends_success_but_saves_nothing(client, session_factory, sent_emails) -> None:
    res = client.post("/api/contact", json={**VALID, "website": "http://spam.example"})

    assert res.status_code == 200
    assert saved(session_factory) == []
    assert sent_emails == []


@pytest.mark.parametrize(
    "override",
    [{"name": ""}, {"email": "not-an-email"}, {"message": "too short"}, {"message": "x" * 5001}],
)
def test_invalid_input_is_rejected(client, session_factory, override) -> None:
    res = client.post("/api/contact", json={**VALID, **override})

    assert res.status_code == 422
    assert saved(session_factory) == []


def test_rate_limit_per_ip(client, session_factory) -> None:
    headers = {"x-forwarded-for": "203.0.113.7"}
    assert client.post("/api/contact", json=VALID, headers=headers).status_code == 200
    assert client.post("/api/contact", json=VALID, headers=headers).status_code == 200
    assert client.post("/api/contact", json=VALID, headers=headers).status_code == 429
    # A different visitor is not affected.
    assert client.post("/api/contact", json=VALID, headers={"x-forwarded-for": "198.51.100.1"}).status_code == 200
    assert len(saved(session_factory)) == 3


def test_message_is_kept_when_email_fails(client, session_factory, monkeypatch) -> None:
    monkeypatch.setattr(main, "send_contact_emails", lambda data, settings: False)

    assert client.post("/api/contact", json=VALID).status_code == 200
    assert saved(session_factory)[0].email_sent is False
