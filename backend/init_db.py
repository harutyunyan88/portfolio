"""Creates the database tables. Run once: `npm run db:init` (safe to re-run)."""

from sqlalchemy import text

from .db import Base, get_engine
from .models import ContactMessage


def main() -> None:
    engine = get_engine()
    Base.metadata.create_all(engine)
    with engine.begin() as conn:
        # Supabase exposes tables in `public` through its REST API. Enabling row-level security
        # with no policies blocks that route, so only this backend (the postgres role) can read messages.
        conn.execute(text(f"alter table {ContactMessage.__tablename__} enable row level security"))
    print(f"✓ Table '{ContactMessage.__tablename__}' is ready (row-level security enabled).")


if __name__ == "__main__":
    main()
