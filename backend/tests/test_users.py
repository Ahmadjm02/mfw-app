from fastapi.testclient import TestClient
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import settings
from app.models import User


def test_list_users_empty(client: TestClient) -> None:
    response = client.get("/api/users")
    assert response.status_code == 200
    assert response.json() == []


def test_list_users_returns_seeded_data(client: TestClient, db_session: Session) -> None:
    db_session.add(User(name="Ada Lovelace", email="ada@example.com"))
    db_session.commit()

    response = client.get("/api/users")

    assert response.status_code == 200
    body = response.json()
    assert len(body) == 1
    assert body[0]["email"] == "ada@example.com"
    assert "id" in body[0] and "created_at" in body[0]


def test_list_users_db_error_returns_clean_500(client: TestClient, monkeypatch) -> None:
    def broken_scalars(*args, **kwargs):
        raise SQLAlchemyError("boom")

    monkeypatch.setattr(Session, "scalars", broken_scalars)

    response = client.get("/api/users")

    assert response.status_code == 500
    assert response.json() == {"detail": "Could not fetch users"}


def test_unexpected_error_returns_json_500_with_cors_headers(
    client: TestClient, monkeypatch
) -> None:
    def broken_scalars(*args, **kwargs):
        raise TypeError("boom")

    monkeypatch.setattr(Session, "scalars", broken_scalars)

    response = client.get("/api/users", headers={"Origin": settings.frontend_url})

    assert response.status_code == 500
    assert response.json() == {"detail": "Internal server error"}
    assert response.headers["access-control-allow-origin"] == settings.frontend_url
