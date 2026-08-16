import os
from collections.abc import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

# Settings has no defaults and .env is gitignored, so a clean clone would fail at import
# time. Set them before anything imports app.config.
os.environ.setdefault("DATABASE_URL", "sqlite:///:memory:")
os.environ.setdefault("FRONTEND_URL", "http://localhost:5173")

from app.db import Base, get_db  # noqa: E402
from app.main import app  # noqa: E402

# SQLite in-memory avoids depending on a running Postgres for unit tests;
# Postgres-specific behavior (constraints, migrations) is exercised via `alembic upgrade head`.
engine = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestSessionLocal = sessionmaker(bind=engine)


@pytest.fixture()
def db_session() -> Generator[Session, None, None]:
    Base.metadata.create_all(engine)
    session = TestSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(engine)


@pytest.fixture()
def client(db_session: Session) -> Generator[TestClient, None, None]:
    def override_get_db() -> Generator[Session, None, None]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()
