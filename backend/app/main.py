import logging

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.logging_config import configure_logging
from app.middleware import catch_unhandled_errors, log_requests
from app.model import User
from app.schemas import UserRead

configure_logging()
logger = logging.getLogger("mfw")

app = FastAPI()

# Registered inside-out: add_middleware inserts at the front of the stack, so the last one
# added is outermost. CORS must stay outermost for its headers to reach every response.
app.middleware("http")(catch_unhandled_errors)
app.middleware("http")(log_requests)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_methods=["GET"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/users", response_model=list[UserRead])
def list_users(db: Session = Depends(get_db)) -> list[User]:
    try:
        return list(db.scalars(select(User)).all())
    except SQLAlchemyError:
        logger.exception("Failed to fetch users")
        raise HTTPException(status_code=500, detail="Could not fetch users") from None
