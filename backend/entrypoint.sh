#!/bin/sh
set -eu

echo ""
echo "  ==============================================="
echo "   API      ${PUBLIC_API_URL}"
echo "   Users    ${PUBLIC_API_URL}/api/users"
echo "   Docs     ${PUBLIC_API_URL}/docs"
echo "  ==============================================="
echo ""

alembic upgrade head
python -m app.seed

exec uvicorn app.main:app --host 0.0.0.0 --port "${APP_PORT}" --no-access-log
