import pandas as pd
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories import MovimientoRepository, ProcesamientoRepository
from app.utils.excel_exporter import exportar_kardex_excel
from app.exceptions import KardexException
from datetime import date


class ExcelService:

    def __init__(self, db: AsyncSession):
        self.db                 = db
        self.movimiento_repo    = MovimientoRepository(db)
        self.procesamiento_repo = ProcesamientoRepository(db)

    async def exportar(
        self,
        procesamiento_id: int,
        codigo:           str | None  = None,
        fecha_desde:      date | None = None,
        fecha_hasta:      date | None = None,
    ) -> bytes:
        """
        Consulta los movimientos desde BD y genera el Excel para descargar.
        Retorna los bytes del archivo .xlsx.
        """
        procesamiento = await self.procesamiento_repo.get_by_id(procesamiento_id)
        if not procesamiento:
            raise KardexException(f"Procesamiento {procesamiento_id} no encontrado.")

        movimientos = await self.movimiento_repo.get_filtrado(
            procesamiento_id = procesamiento_id,
            codigo           = codigo,
            fecha_desde      = fecha_desde,
            fecha_hasta      = fecha_hasta,
        )

        if not movimientos:
            raise KardexException("No hay movimientos para exportar con los filtros aplicados.")

        # Convertir a DataFrame para el exportador
        df = pd.DataFrame([{
            "Codigo":           m.producto.codigo if m.producto else "",
            "Fecha":            m.fecha,
            "Tipo":             m.tipo_comprobante,
            "Serie":            m.serie,
            "Numero":           m.numero,
            "Tipo_Operacion":   m.tipo_operacion,
            "Ent_Cantidad":     float(m.ent_cantidad),
            "Ent_Costo_Unit":   float(m.ent_costo_unit),
            "Ent_Costo_Total":  float(m.ent_costo_total),
            "Sal_Cantidad":     float(m.sal_cantidad),
            "Sal_Costo_Unit":   float(m.sal_costo_unit),
            "Sal_Costo_Total":  float(m.sal_costo_total),
            "Saldo_Cantidad":   float(m.saldo_cantidad),
            "Saldo_Costo_Unit": float(m.saldo_costo_unit),
            "Saldo_Costo_Total":float(m.saldo_costo_total),
        } for m in movimientos])

        return exportar_kardex_excel(df)