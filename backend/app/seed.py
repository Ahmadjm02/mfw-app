import logging

from sqlalchemy import select

from app.db import SessionLocal
from app.models import User

logger = logging.getLogger("mfw")

DEMO_USERS = [
    {"name": "Ahmad Jehad", "email": "ahmad@example.com"},
    {"name": "Abdullah Hussien", "email": "abdullah@example.com"},
    {"name": "Mohammed Ali", "email": "mohammed@example.com"},
]


def seed() -> None:
    with SessionLocal() as db:
        if db.scalar(select(User.id).limit(1)) is not None:
            logger.info("Users table already has data, skipping seed")
            return

        db.add_all(User(**u) for u in DEMO_USERS)
        db.commit()
        logger.info("Seeded %d demo users", len(DEMO_USERS))


if __name__ == "__main__":
    from app.logging_config import configure_logging

    configure_logging()
    seed()
