import api from './api'
import type { KardexResponse } from '../types'

// Los movimientos se consultan a través del endpoint de kardex
export const getMovimientosPorProcesamiento = async (
  procesamientoId: number,
  codigo?: string,
): Promise<KardexResponse> => {
  const params: Record<string, string | number> = {}
  if (codigo) params.codigo = codigo
  const response = await api.get(`/api/v1/kardex/consultar/${procesamientoId}`, { params })
  return response.data
}
