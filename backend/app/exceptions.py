from fastapi import HTTPException, Request
from fastapi.responses import JSONResponse


# ── Excepción base del dominio ────────────────────────────────────────────────
class KardexException(Exception):
    """Excepción de negocio del sistema Kardex."""
    def __init__(self, message: str, status_code: int = 400):
        self.message     = message
        self.status_code = status_code
        super().__init__(message)


class NotFoundException(KardexException):
    def __init__(self, message: str = "Recurso no encontrado."):
        super().__init__(message, status_code=404)


class DuplicadoException(KardexException):
    def __init__(self, message: str = "Códigos duplicados detectados."):
        super().__init__(message, status_code=409)


class ArchivoInvalidoException(KardexException):
    def __init__(self, message: str = "El archivo no tiene un formato válido."):
        super().__init__(message, status_code=422)


# ── Handlers para registrar en FastAPI ───────────────────────────────────────
async def kardex_exception_handler(request: Request, exc: KardexException) -> JSONResponse:
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )


async def generic_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={"detail": "Error interno del servidor. Intenta nuevamente."}
    )