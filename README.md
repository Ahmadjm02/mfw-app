# MAKE WORK FLOW: Users Registry

FastAPI + Postgres backend, React/TypeScript (Vite) frontend. One button, fetches `GET /api/users`.

## Run

```bash
docker compose up --build
```

On Linux, if your user isn't in the docker group, prefix with sudo: `sudo docker compose up --build`.

| Service  | URL                                    |
| -------- | -------------------------------------- |
| App      | http://localhost:8080                  |
| API      | http://localhost:8000/api/users        |
| Docs     | http://localhost:8000/docs             |
| Postgres | localhost:5433 (postgres/postgres/mfw) |

Migrations and seeding run in the backend container. Ports are set in `docker-compose.yml` only.
`docker compose down -v` drops the database volume.

## Run without Docker

```bash
docker compose up postgres

cd backend && cp .env.example .env
uv sync && uv run alembic upgrade head && uv run python -m app.seed
uv run uvicorn app.main:app --reload      # http://localhost:8000

cd frontend && cp .env.example .env
npm install && npm run dev                # http://localhost:5173
```

`backend/.env`

```
DATABASE_URL=postgresql+psycopg://postgres:postgres@localhost:5433/mfw
FRONTEND_URL=http://localhost:5173
LOG_LEVEL=INFO
```

`frontend/.env`

```
VITE_API_URL=http://localhost:8000
```

`DATABASE_URL` and `FRONTEND_URL` are required; `LOG_LEVEL` defaults to `INFO`. `FRONTEND_URL` is
the only allowed CORS origin and is matched exactly. `VITE_API_URL` is inlined at build time.

Tests: `cd backend && uv run pytest` (in-memory SQLite, nothing needs to be running).

## Decisions

- **Synchronous SQLAlchemy 2.0** (`select()`, `Mapped[]` / `mapped_column()`). One read endpoint
  does not need async.
- **Alembic instead of `create_all()`**, because migrations are how schema changes ship.
- **Pydantic `UserRead` separate from the ORM model**, so the response shape is deliberate.
- **CORS scoped to `FRONTEND_URL`**, never `*`.
- **Idempotent seed on every start**, so the first click returns real rows.
- **Healthcheck-gated startup**: Postgres passes `pg_isready` before the backend starts, backend
  answers `/health` before the frontend starts.
- **Typed errors end to end**: the backend logs and returns a clean message, the frontend maps
  timeout, network, config, client and server failures to distinct states.
- **Static frontend behind nginx** from a multi-stage build; `uv sync --frozen --no-dev` keeps
  pytest and ruff out of the backend image.
