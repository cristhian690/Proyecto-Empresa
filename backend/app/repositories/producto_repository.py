from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.producto import Producto


class ProductoRepository:

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_codigo(self, codigo: str) -> Producto | None:
        result = await self.db.execute(
            select(Producto).where(Producto.codigo == codigo)
        )
        return result.scalar_one_or_none()

    async def get_by_id(self, producto_id: int) -> Producto | None:
        result = await self.db.execute(
            select(Producto).where(Producto.id == producto_id)
        )
        return result.scalar_one_or_none()

    async def get_or_create(self, codigo: str, descripcion: str | None = None) -> Producto:
        producto = await self.get_by_codigo(codigo)
        if not producto:
            producto = Producto(codigo=codigo, descripcion=descripcion)
            self.db.add(producto)
            await self.db.flush()  # obtener id sin commit
        return producto

    async def get_all(self) -> list[Producto]:
        result = await self.db.execute(select(Producto).order_by(Producto.codigo))
        return list(result.scalars().all())