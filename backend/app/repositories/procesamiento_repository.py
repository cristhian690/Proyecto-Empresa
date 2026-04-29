from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.procesamiento import Procesamiento


class ProcesamientoRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def crear(
        self,
        nombre_archivo:       str,
        total_registros:      int,
        productos_procesados: int,
        estado:               str,
        alertas:              dict,
    ) -> Procesamiento:
        procesamiento = Procesamiento(
            nombre_archivo       = nombre_archivo,
            total_registros      = total_registros,
            productos_procesados = productos_procesados,
            estado               = estado,
            alertas              = alertas,
        )
        self.db.add(procesamiento)
        await self.db.flush()
        return procesamiento

    async def get_by_id(self, procesamiento_id: int) -> Procesamiento | None:
        result = await self.db.execute(
            select(Procesamiento).where(Procesamiento.id == procesamiento_id)
        )
        return result.scalar_one_or_none()

    async def get_historial(self, limit: int = 20, offset: int = 0) -> list[Procesamiento]:
        result = await self.db.execute(
            select(Procesamiento)
            .order_by(Procesamiento.creado_en.desc())
            .limit(limit)
            .offset(offset)
        )
        return list(result.scalars().all())

    async def actualizar_estado(self, procesamiento_id: int, estado: str) -> None:
        procesamiento = await self.get_by_id(procesamiento_id)
        if procesamiento:
            procesamiento.estado = estado
            await self.db.flush()