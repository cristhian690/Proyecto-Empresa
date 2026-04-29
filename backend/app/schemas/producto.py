from pydantic import BaseModel, ConfigDict
from datetime import datetime


class ProductoBase(BaseModel):
    codigo:      str
    descripcion: str | None = None


class ProductoCreate(ProductoBase):
    pass


class ProductoResponse(ProductoBase):
    id:        int
    creado_en: datetime

    model_config = ConfigDict(from_attributes=True)