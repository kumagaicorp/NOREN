from typing import Any

from fastapi import HTTPException, status
from pydantic import BaseModel


class ErrorResponse(BaseModel):
    code: str
    message: str
    details: dict[str, Any] | None = None


class AppException(HTTPException):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: dict[str, Any] | None = None,
    ):
        self.code = code
        self.message = message
        self.details = details
        super().__init__(
            status_code=status_code,
            detail=ErrorResponse(code=code, message=message, details=details).model_dump(),
        )


class InternalError(AppException):
    def __init__(self, message: str = "Internal server error", details: dict[str, Any] | None = None):
        super().__init__(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            code="INTERNAL_ERROR",
            message=message,
            details=details,
        )
