import io
import json
from datetime import date

import pytest
from fastapi.testclient import TestClient
from pypdf import PdfReader

from backend import main
from backend.config import Settings, get_settings
from backend.cv import CONTENT_PATH, LOCALES_DIR, Translator, years_of_experience


@pytest.fixture
def client():
    main.app.dependency_overrides[get_settings] = lambda: Settings(_env_file=None)
    yield TestClient(main.app)
    main.app.dependency_overrides.clear()


def pdf_text(data: bytes) -> str:
    return "\n".join(page.extract_text() for page in PdfReader(io.BytesIO(data)).pages)


def pdf_links(data: bytes) -> set[str]:
    links = set()
    for page in PdfReader(io.BytesIO(data)).pages:
        for annot in page.get("/Annots") or []:
            action = annot.get_object().get("/A")
            if action and "/URI" in action:
                links.add(action["/URI"])
    return links


@pytest.mark.parametrize(
    ("lang", "expected"),
    [("en", "Arsen Harutyunyan"), ("ru", "Арсен Арутюнян"), ("hy", "Հարությունյան")],
)
def test_cv_in_each_language(client, lang, expected) -> None:
    res = client.get(f"/api/cv?lang={lang}")

    assert res.status_code == 200
    assert res.headers["content-type"] == "application/pdf"
    assert res.headers["content-disposition"] == f'attachment; filename="Arsen_Harutyunyan_CV_{lang.upper()}.pdf"'
    assert res.content.startswith(b"%PDF")
    text = pdf_text(res.content)
    assert expected in text
    assert "arsen.harutyunyan088@gmail.com" in text


def test_cv_contacts_are_clickable_links(client) -> None:
    res = client.get("/api/cv?lang=en")
    content = json.loads(CONTENT_PATH.read_text(encoding="utf-8"))
    assert {contact["href"] for contact in content["contacts"]} <= pdf_links(res.content)


def test_cv_can_be_shown_inline(client) -> None:
    res = client.get("/api/cv?lang=en&download=false")
    assert res.headers["content-disposition"].startswith("inline;")


def test_unknown_language_is_rejected(client) -> None:
    assert client.get("/api/cv?lang=de").status_code == 422


@pytest.mark.parametrize(
    ("today", "years"),
    [(date(2026, 9, 30), 5), (date(2026, 10, 1), 6), (date(2027, 3, 15), 6)],
)
def test_years_of_experience_counts_calendar_months(today, years) -> None:
    assert years_of_experience("2020-10", today) == years


def test_translator_falls_back_to_english_and_fills_placeholders() -> None:
    t = Translator({"a": "Hi {{name}}"}, {"a": "Hello {{name}}", "b": "Only English"})
    assert t("a", name="Arsen") == "Hi Arsen"
    assert t("b") == "Only English"
    assert t("missing.key") == "missing.key"


def test_every_content_item_has_texts_in_every_language() -> None:
    """Adding a job, project or course to content.json without its texts would print raw keys in the CV."""
    content = json.loads(CONTENT_PATH.read_text(encoding="utf-8"))
    keys = [f"experience.items.{job['id']}.role" for job in content["experience"]]
    keys += [f"experience.items.{job['id']}.bullets" for job in content["experience"]]
    keys += [f"projects.items.{p['id']}.title" for p in content["projects"]]
    keys += [f"education.items.{c['id']}.title" for c in content["courses"]]
    keys += [f"skills.groups.{g['id']}" for g in content["skillGroups"]]

    for lang in ("en", "ru", "hy"):
        messages = json.loads((LOCALES_DIR / f"{lang}.json").read_text(encoding="utf-8"))
        t = Translator(messages, fallback={})
        missing = [key for key in keys if t(key) == key]
        assert not missing, f"{lang}.json is missing: {missing}"
