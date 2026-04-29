import { useState } from 'react'
import type { FiltroFecha, ModoFiltro } from '../types'

export const useFiltros = () => {
  const [codigo, setCodigo]       = useState<string>('')
  const [modoFiltro, setModoFiltro] = useState<ModoFiltro>('anio_mes')
  const [anio, setAnio]           = useState<number | undefined>(undefined)
  const [mes, setMes]             = useState<number | undefined>(undefined)
  const [fechaExacta, setFechaExacta] = useState<string>('')
  const [fechaDesde, setFechaDesde]   = useState<string>('')
  const [fechaHasta, setFechaHasta]   = useState<string>('')

  const getFiltroFecha = (): FiltroFecha => {
    if (modoFiltro === 'anio_mes') {
      return { modo: 'anio_mes', anio, mes }
    }
    if (modoFiltro === 'exacta') {
      return { modo: 'exacta', fecha_exacta: fechaExacta }
    }
    return { modo: 'rango', fecha_desde: fechaDesde, fecha_hasta: fechaHasta }
  }

  const resetFiltros = () => {
    setAnio(undefined)
    setMes(undefined)
    setFechaExacta('')
    setFechaDesde('')
    setFechaHasta('')
  }

  return {
    codigo, setCodigo,
    modoFiltro, setModoFiltro,
    anio, setAnio,
    mes, setMes,
    fechaExacta, setFechaExacta,
    fechaDesde, setFechaDesde,
    fechaHasta, setFechaHasta,
    getFiltroFecha,
    resetFiltros,
  }
}