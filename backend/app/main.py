from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.core.config import settings
from app.core.database import engine, Base
from app.routers import kardex_router, historial_router, saldos_router
from app.exceptions import KardexException, kardex_exception_handler, generic_exception_handler

# ── Importar modelos para que Alembic los detecte ─────────────────────────────
from app.models import Producto, SaldoInicial, Procesamiento, Movimiento  # noqa: F401


# ── Lifespan (reemplaza el deprecado on_event) ────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.DEBUG:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    yield


# ── Instancia de la aplicación ────────────────────────────────────────────────
app = FastAPI(
    title       = settings.APP_NAME,
    version     = settings.APP_VERSION,
    description = "API para el procesamiento de Kardex de Inventario con Costo Promedio Ponderado.",
    docs_url    = "/docs",
    redoc_url   = "/redoc",
    lifespan    = lifespan,
)


# ── CORS ──────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins     = settings.ALLOWED_ORIGINS,
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)


# ── Handlers de excepciones ───────────────────────────────────────────────────
# RequestValidationError debe registrarse explícitamente para que no sea
# absorbido por el handler genérico de Exception (devolvería 500 en vez de 422)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc: RequestValidationError) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

app.add_exception_handler(KardexException, kardex_exception_handler)
app.add_exception_handler(Exception,       generic_exception_handler)


# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(kardex_router,    prefix="/api/v1")
app.include_router(historial_router, prefix="/api/v1")
app.include_router(saldos_router,    prefix="/api/v1")


# ── Health check ──────────────────────────────────────────────────────────────
@app.get("/health", tags=["Sistema"])
async def health_check():
    return {
        "status":  "ok",
        "app":     settings.APP_NAME,
        "version": settings.APP_VERSION,
    }
