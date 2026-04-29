from pydantic import BaseModel
from decimal import Decimal
from .movimiento import MovimientoResponse
from .procesamiento import AlertasProcesamiento


# ── Métricas resumen del kardex ───────────────────────────────────────────────
class MetricasKardex(BaseModel):
    total_ent_cantidad:   Decimal
    total_ent_costo:      Decimal
    total_sal_cantidad:   Decimal
    total_sal_costo:      Decimal
    saldo_final_cantidad: Decimal
    saldo_final_costo:    Decimal


# ── Respuesta completa del kardex procesado ───────────────────────────────────
class KardexResponse(BaseModel):
    procesamiento_id:     int
    codigo:               str
    total_registros:      int
    errores_integridad:   int
    alertas:              AlertasProcesamiento
    metricas:             MetricasKardex
    movimientos:          list[MovimientoResponse]


# ── Respuesta al subir archivos (antes de consultar movimientos) ──────────────
class UploadResponse(BaseModel):
    procesamiento_id:     int
    total_registros:      int
    productos_procesados: int
    estado:               str
    alertas:              AlertasProcesamiento


# ── Parámetros de filtro para consultar el kardex ────────────────────────────
class FiltroKardex(BaseModel):
    codigo:        str | None = None
    anio:          int | None = None
    mes:           int | None = None
    fecha_exacta:  str | None = None
    fecha_desde:   str | None = None
    fecha_hasta:   str | None = None