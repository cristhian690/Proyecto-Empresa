import api from './api'

export interface SaldoResponse {
  id:             number
  producto_id:    number
  codigo:         string
  descripcion:    string | null
  fecha:          string
  cantidad:       number
  costo_unitario: number
  costo_total:    number
  creado_en:      string
}

export const getAllSaldos = async (limit = 100, offset = 0): Promise<SaldoResponse[]> => {
  const response = await api.get('/api/v1/saldos/', { params: { limit, offset } })
  return response.data
}

export const getSaldoById = async (id: number): Promise<SaldoResponse> => {
  const response = await api.get(`/api/v1/saldos/${id}`)
  return response.data
}

export const deleteSaldo = async (id: number): Promise<void> => {
  await api.delete(`/api/v1/saldos/${id}`)
}
