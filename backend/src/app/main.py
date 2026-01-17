from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from .api.health import router as health_router
from .core.config import settings
from .core.errors import AppException
from .core.logging import logger

app = FastAPI(title=settings.app_name)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    logger.error(f"AppException: {exc.code} - {exc.message}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.code, "message": exc.message, "details": exc.details},
    )


app.include_router(health_router)
