from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

ROOT = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Read from environment variables; locally also from the project's .env file."""

    model_config = SettingsConfigDict(env_file=ROOT / ".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = ""

    # Gmail SMTP. Email is skipped (messages are still saved) until these are set.
    smtp_host: str = "smtp.gmail.com"
    smtp_port: int = 465
    smtp_user: str = ""
    smtp_password: str = ""
    contact_to: str = "arsen.harutyunyan088@gmail.com"

    # Salt for hashing visitor IPs, so rate limiting works without storing raw IPs.
    ip_hash_salt: str = "change-me"
    # Max messages from one IP per hour.
    rate_limit_per_hour: int = 3

    # Address printed on the CV. Empty means: Vercel's production domain, or else the address of the request.
    site_url: str = ""
    vercel_project_production_url: str = ""

    @property
    def email_enabled(self) -> bool:
        return bool(self.smtp_user and self.smtp_password)


@lru_cache
def get_settings() -> Settings:
    return Settings()
