"""Builds the CV as a PDF from the same data as the website.

Facts come from src/data/content.json and texts from src/i18n/locales/<lang>.json, so editing the
website's content also updates the CV, in every language.
"""

import json
import re
from datetime import date
from functools import lru_cache
from pathlib import Path
from typing import Any, Literal

from fpdf import FPDF
from fpdf.enums import XPos, YPos

Lang = Literal["en", "ru", "hy"]

ROOT = Path(__file__).resolve().parent.parent
CONTENT_PATH = ROOT / "src" / "data" / "content.json"
LOCALES_DIR = ROOT / "src" / "i18n" / "locales"
FONTS_DIR = Path(__file__).resolve().parent / "fonts"
PHOTO_PATH = Path(__file__).resolve().parent / "assets" / "avatar.jpg"
# Font Awesome icons from react-icons (fa6), saved as SVG with a fixed fill colour.
ICONS_DIR = Path(__file__).resolve().parent / "assets" / "icons"

# Colours (RGB) matching the website's light theme.
TEXT = (15, 23, 42)
MUTED = (91, 100, 119)
ACCENT = (79, 70, 229)
RULE = (226, 232, 240)
# The header band, styled after the original CV.
BAND = (229, 231, 235)
BAND_TEXT = (55, 65, 81)

MARGIN = 16
PHOTO_SIZE = 38
ICON_SIZE = 3.4
CONTACT_ROW = 6.2


def _load_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def years_of_experience(career_start: str, today: date) -> int:
    """Whole years since 'YYYY-MM', counted in calendar months (same rule as the website)."""
    year, month = (int(part) for part in career_start.split("-"))
    return ((today.year - year) * 12 + today.month - month) // 12


def _month(value: str) -> str:
    year, month = value.split("-")
    return f"{month}/{year}"


class Translator:
    """Looks up dotted keys like 'apps.experience' and fills {{placeholders}}, like i18next."""

    def __init__(self, messages: dict[str, Any], fallback: dict[str, Any]) -> None:
        self.messages = messages
        self.fallback = fallback

    @staticmethod
    def _find(tree: dict[str, Any], key: str) -> Any:
        node: Any = tree
        for part in key.split("."):
            if not isinstance(node, dict) or part not in node:
                return None
            node = node[part]
        return node

    def __call__(self, key: str, **values: Any) -> Any:
        found = self._find(self.messages, key)
        if found is None:
            found = self._find(self.fallback, key)
        if found is None:
            return key

        def fill(text: str) -> str:
            return re.sub(r"\{\{(\w+)\}\}", lambda m: str(values.get(m.group(1), m.group(0))), text)

        return [fill(item) for item in found] if isinstance(found, list) else fill(found)


class CvPdf(FPDF):
    def __init__(self) -> None:
        super().__init__(format="A4")
        self.set_margins(MARGIN, MARGIN, MARGIN)
        self.set_auto_page_break(auto=True, margin=16)
        self.add_font("Noto", "", FONTS_DIR / "NotoSans-Regular.ttf")
        self.add_font("Noto", "B", FONTS_DIR / "NotoSans-Bold.ttf")
        self.add_font("NotoArmenian", "", FONTS_DIR / "NotoSansArmenian-Regular.ttf")
        self.add_font("NotoArmenian", "B", FONTS_DIR / "NotoSansArmenian-Bold.ttf")
        # Noto Sans has no Armenian letters; those characters are drawn with Noto Sans Armenian.
        self.set_fallback_fonts(["NotoArmenian"])

    def font(self, size: float, bold: bool = False, color: tuple[int, int, int] = TEXT) -> None:
        self.set_font("Noto", "B" if bold else "", size)
        self.set_text_color(*color)

    def paragraph(self, text: str, size: float = 9.5, color: tuple[int, int, int] = TEXT, line: float = 4.8) -> None:
        self.font(size, color=color)
        self.multi_cell(0, line, text, align="L", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    def section(self, title: str) -> None:
        # Start a new page rather than leaving a heading alone at the bottom.
        if self.get_y() > self.h - 45:
            self.add_page()
        self.ln(4)
        self.font(11.5, bold=True, color=ACCENT)
        self.cell(0, 7, title.upper(), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_draw_color(*RULE)
        self.set_line_width(0.3)
        self.line(MARGIN, self.get_y(), self.w - MARGIN, self.get_y())
        self.ln(2.5)

    def bullets(self, items: list[str]) -> None:
        self.font(9.2)
        for item in items:
            self.set_x(MARGIN + 2)
            self.cell(4, 4.6, "•")
            self.multi_cell(0, 4.6, item, align="L", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
            self.ln(0.4)

    def title_with_period(self, title: str, period: str) -> None:
        self.font(10.5, bold=True)
        period_width = self.get_string_width(period) + 2
        y = self.get_y()
        self.multi_cell(self.epw - period_width - 2, 5.5, title, align="L", new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        after = self.get_y()
        self.set_xy(self.w - MARGIN - period_width, y)
        self.font(9, color=MUTED)
        self.cell(period_width, 5.5, period, align="R")
        self.set_xy(MARGIN, after)


def build_cv(lang: Lang, today: date | None = None) -> bytes:
    today = today or date.today()
    # The PDF only changes with the content, the language and the month (years of experience).
    return _build_cv_cached(lang, today.replace(day=1))


@lru_cache(maxsize=12)
def _build_cv_cached(lang: Lang, month: date) -> bytes:
    content = _load_json(CONTENT_PATH)
    t = Translator(_load_json(LOCALES_DIR / f"{lang}.json"), _load_json(LOCALES_DIR / "en.json"))
    years = years_of_experience(content["careerStart"], month)
    contacts = {c["id"]: c for c in content["contacts"]}

    pdf = CvPdf()
    pdf.set_title(f"{t('profile.name')} — {t('profile.role')}")
    pdf.set_author(t("profile.name"))
    pdf.set_lang(lang)
    pdf.add_page()

    # Header: a full-width grey band like the original CV. Name and role, clickable contacts in two
    # columns and the summary on the left; the photo on the right.
    text_width = pdf.epw - PHOTO_SIZE - 10
    summary = " ".join(t("about.bio", years=years))
    # (icon, text, link) in reading order, two per row.
    contact_items = [
        ("email", contacts["email"]["value"], contacts["email"]["href"]),
        ("phone", contacts["phone"]["value"], contacts["phone"]["href"]),
        ("location", t("profile.location"), None),
        ("linkedin", contacts["linkedin"]["value"], contacts["linkedin"]["href"]),
        ("github", contacts["github"]["value"], contacts["github"]["href"]),
        ("telegram", contacts["telegram"]["value"], contacts["telegram"]["href"]),
    ]
    rows = (len(contact_items) + 1) // 2
    pdf.font(9.3)
    summary_height = pdf.multi_cell(text_width, 4.7, summary, dry_run=True, output="HEIGHT")
    top = 12
    band_height = max(top + 10 + 2 + rows * CONTACT_ROW + 3 + summary_height + 9, PHOTO_SIZE + 2 * top)
    pdf.set_fill_color(*BAND)
    pdf.rect(0, 0, pdf.w, band_height, style="F")

    pdf.set_xy(MARGIN, top)
    pdf.font(20, bold=True, color=BAND_TEXT)
    name = t("profile.name")
    pdf.cell(pdf.get_string_width(name) + 3, 10, name)
    pdf.font(12, color=BAND_TEXT)
    pdf.cell(0, 10.6, t("profile.role"), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
    pdf.ln(2)

    column = text_width / 2
    contacts_top = pdf.get_y()
    for i, (icon, text, link) in enumerate(contact_items):
        x = MARGIN + (i % 2) * column
        y = contacts_top + (i // 2) * CONTACT_ROW
        pdf.image(ICONS_DIR / f"{icon}.svg", x=x, y=y + (CONTACT_ROW - ICON_SIZE) / 2, h=ICON_SIZE)
        pdf.set_xy(x + ICON_SIZE + 2, y)
        pdf.font(9.3, color=BAND_TEXT)
        pdf.cell(column - ICON_SIZE - 3, CONTACT_ROW, text, link=link or "")
    pdf.set_xy(MARGIN, contacts_top + rows * CONTACT_ROW + 3)
    pdf.font(9.3, color=BAND_TEXT)
    pdf.multi_cell(text_width, 4.7, summary, align="L", new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    if PHOTO_PATH.exists():
        x, y = pdf.w - MARGIN - PHOTO_SIZE, (band_height - PHOTO_SIZE) / 2
        # Despite its docs, round_clip's `r` acts as the diameter (checked by rendering the PDF).
        with pdf.round_clip(x=x, y=y, r=PHOTO_SIZE):
            pdf.image(PHOTO_PATH, x=x, y=y, w=PHOTO_SIZE, h=PHOTO_SIZE)
    pdf.set_y(band_height + 2)

    # Experience
    pdf.section(t("apps.experience"))
    for i, job in enumerate(content["experience"]):
        if i:
            pdf.ln(3)
        end = _month(job["end"]) if job["end"] else t("common.present")
        pdf.title_with_period(t(f"experience.items.{job['id']}.role"), f"{_month(job['start'])} – {end}")
        pdf.font(9.5, bold=True, color=ACCENT)
        details = [job["company"], t(f"experience.types.{job['type']}"), t(f"experience.items.{job['id']}.location")]
        pdf.multi_cell(0, 5, "  ·  ".join(details), new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        pdf.ln(1)
        pdf.bullets(t(f"experience.items.{job['id']}.bullets"))
        pdf.paragraph(" · ".join(job["tech"]), size=8.5, color=MUTED, line=4.3)

    # Skills
    pdf.section(t("apps.skills"))
    for group in content["skillGroups"]:
        label = t("skills.groups." + group["id"])
        pdf.font(9.2)
        pdf.multi_cell(
            0, 4.8, f"**{label}:** {', '.join(group['skills'])}", markdown=True, align="L", new_x=XPos.LMARGIN, new_y=YPos.NEXT
        )
        pdf.ln(0.8)

    # Projects
    pdf.section(t("apps.projects"))
    for i, project in enumerate(content["projects"]):
        if i:
            pdf.ln(2.5)
        kind_and_role = t(f"projects.kinds.{project['kind']}") + " · " + t(f"projects.roles.{project['role']}")
        pdf.title_with_period(t(f"projects.items.{project['id']}.title"), kind_and_role)
        pdf.paragraph(t(f"projects.items.{project['id']}.description"), size=9.2, line=4.6)
        pdf.paragraph(" · ".join(project["tech"]), size=8.5, color=MUTED, line=4.3)

    # Education
    pdf.section(t("apps.education"))
    for i, course in enumerate(content["courses"]):
        if i:
            pdf.ln(2)
        period = f"{_month(course['start'])} – {_month(course['end'])}"
        title = t("education.items." + course["id"] + ".title")
        pdf.title_with_period(f"{title} — {course['school']}", period)
        pdf.paragraph(", ".join(course["topics"]), size=8.8, color=MUTED, line=4.4)

    # Languages
    pdf.section(t("education.languagesTitle"))
    for spoken in content["spokenLanguages"]:
        pdf.font(9.2, bold=True)
        pdf.cell(pdf.get_string_width(t("education.spoken." + spoken["id"])) + 1, 5, t("education.spoken." + spoken["id"]))
        pdf.font(9.2, color=MUTED)
        pdf.cell(0, 5, "— " + t("education.levels." + spoken["level"]), new_x=XPos.LMARGIN, new_y=YPos.NEXT)

    return bytes(pdf.output())
