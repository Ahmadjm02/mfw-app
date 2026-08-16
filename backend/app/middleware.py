import logging
import time
from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from fastapi.responses import JSONResponse

logger = logging.getLogger("mfw")

CallNext = Callable[[Request], Awaitable[Response]]


async def log_requests(request: Request, call_next: CallNext) -> Response:
    start = time.perf_counter()
    status = 500
    try:
        response = await call_next(request)
        status = response.status_code
        return response
    finally:
        logger.info(
            "%s %s %s %.1fms",
            request.method,
            request.url.path,
            status,
            (time.perf_counter() - start) * 1000,
        )


async def catch_unhandled_errors(request: Request, call_next: CallNext) -> Response:
    # Starlette's ServerErrorMiddleware sits outside CORSMiddleware, so an exception that
    # reaches it returns a plain-text 500 with no CORS headers and the browser reports a
    # CORS failure instead of the error. Convert to JSON here, inside the CORS layer.
    try:
        return await call_next(request)
    except Exception:
        logger.exception("Unhandled error on %s %s", request.method, request.url.path)
        return JSONResponse(status_code=500, content={"detail": "Internal server error"})
