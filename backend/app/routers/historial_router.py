from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repositories import ProcesamientoRepository
from app.schemas.procesamiento import ProcesamientoResponse, ProcesamientoResumen
from app.exceptions import NotFoundException


router = APIRouter(prefix="/historial", tags=["Historial"])


@router.get("/", response_model=list[ProcesamientoResumen])
async def listar_historial(
    limit:  int = Query(20, ge=1, le=100),
    offset: int = Query(0,  ge=0),
    db:     AsyncSession = Depends(get_db),
):
    """
    Lista todos los procesamientos realizados, del más reciente al más antiguo.
    """
    repo = ProcesamientoRepository(db)
    return await repo.get_historial(limit=limit, offset=offset)


@router.get("/{procesamiento_id}", response_model=ProcesamientoResponse)
async def get_procesamiento(
    procesamiento_id: int,
    db: AsyncSession = Depends(get_db),
):
    """
    Retorna el detalle de un procesamiento específico con sus alertas.
    """
    repo          = ProcesamientoRepository(db)
    procesamiento = await repo.get_by_id(procesamiento_id)
    if not procesamiento:
        raise NotFoundException(f"Procesamiento {procesamiento_id} no encontrado.")
    return procesamiento