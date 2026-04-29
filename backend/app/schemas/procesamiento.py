from pydantic import BaseModel
from datetime import datetime
from app.models.procesamiento import EstadoProceso


class AlertasProcesamiento(BaseModel):
    sin_saldo_inicial: list[str] = []
    saldo_negativo:    list[str] = []
    duplicados:        list[str] = []


class ProcesamientoResponse(BaseModel):
    id:                   int
    nombre_archivo:       str
    total_registros:      int
    productos_procesados: int
    estado:               EstadoProceso
    alertas:              AlertasProcesamiento
    creado_en:            datetime

    model_config = {"from_attributes": True}


class ProcesamientoResumen(BaseModel):
    id:                   int
    nombre_archivo:       str
    total_registros:      int
    productos_procesados: int
    estado:               EstadoProceso
    creado_en:            datetime

    model_config = {"from_attributes": True}