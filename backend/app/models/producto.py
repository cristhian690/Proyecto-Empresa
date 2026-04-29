from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base
from datetime import datetime


class Producto(Base):
    __tablename__ = "productos"

    id:          Mapped[int]      = mapped_column(primary_key=True, index=True)
    codigo:      Mapped[str]      = mapped_column(String(20), unique=True, index=True, nullable=False)
    descripcion: Mapped[str]      = mapped_column(String(255), nullable=True)
    creado_en:   Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # ── Relaciones ─────────────────────────────────────────────────────────────
    saldo_inicial: Mapped["SaldoInicial"]  = relationship("SaldoInicial", back_populates="producto", uselist=False)
    movimientos:   Mapped[list["Movimiento"]] = relationship("Movimiento", back_populates="producto")