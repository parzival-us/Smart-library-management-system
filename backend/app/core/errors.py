from __future__ import annotations
from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

class AppError(Exception):
    def __init__(self, message: str, status_code: int):
        self.message = message
        self.status_code = status_code

class NotFoundError(AppError):
    def __init__(self, message: str = "Not Found"):
        super().__init__(message, 404)

class ForbiddenError(AppError):
    def __init__(self, message: str = "Forbidden"):
        super().__init__(message, 403)

class ConflictError(AppError):
    def __init__(self, message: str = "Conflict"):
        super().__init__(message, 409)

class BadRequestError(AppError):
    def __init__(self, message: str = "Bad Request"):
        super().__init__(message, 400)

def register_exception_handlers(app: FastAPI):
    @app.exception_handler(AppError)
    async def app_error_handler(request: Request, exc: AppError):
        return JSONResponse(
            status_code=exc.status_code,
            content={"detail": exc.message}
        )
