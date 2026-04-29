from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ── Aplicación ─────────────────────────────────────────────────────────────
    APP_NAME: str = "Kardex System"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # ── Base de datos ──────────────────────────────────────────────────────────
    DATABASE_URL: str

    # ── Seguridad JWT ──────────────────────────────────────────────────────────
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

    # ── CORS ───────────────────────────────────────────────────────────────────
    ALLOWED_ORIGINS: List[str] = ["http://localhost:5173"]

    # ── Archivos ───────────────────────────────────────────────────────────────
    MAX_FILE_SIZE_MB: int = 50
    UPLOAD_DIR: str = "uploads"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()