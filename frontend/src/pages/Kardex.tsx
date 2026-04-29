import { useEffect, useState, useMemo } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useKardex }      from '../hooks/useKardex'
import KardexTable        from '../components/KardexTable'
import AlertaBanner       from '../components/AlertaBanner'
import FiltroCodigo       from '../components/FiltroCodigo'
import FiltroFecha        from '../components/FiltroFecha'
import BadgeProducto      from '../components/BadgeProducto'
import Sidebar            from '../components/Sidebar'
import MetricCard         from '../components/MetricCard'
import { IconFilter, IconShield, IconDownload, IconSpinner } from '../components/icons'
import type { FiltroFecha as IFiltroFecha } from '../types'

// ── Estilo base compartido para botones del topbar ────────────────────────────
const btnBase: React.CSSProperties = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '6px 12px', borderRadius: 7,
  fontSize: 11, fontWeight: 600,
  fontFamily: "'Inter', sans-serif", cursor: 'pointer',
  transition: 'opacity .12s',
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function Kardex() {
  const { procesamiento_id } = useParams<{ procesamiento_id: string }>()
  const navigate             = useNavigate()
  const location             = useLocation()

  const {
    movimientos, metricas, alertas,
    loading, error, exporting,
    totalRegistros, erroresIntegridad,
    cargarKardex, descargarExcel,
  } = useKardex()

  const [codigo,          setCodigo]          = useState('')
  const [filtroFecha,     setFiltroFecha]     = useState<IFiltroFecha>({ modo: 'anio_mes' })
  const [mostrarSemaforo, setMostrarSemaforo] = useState(false)
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(true)

  const id = Number(procesamiento_id)

  useEffect(() => {
    if (!id) return
    cargarKardex(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleBuscarCodigo = (cod: string) => {
    setCodigo(cod)
    cargarKardex(id, { ...filtroFecha, codigo: cod || undefined })
  }
  const handleCambiarFecha = (nuevoFiltro: IFiltroFecha) => {
    setFiltroFecha(nuevoFiltro)
    cargarKardex(id, { ...nuevoFiltro, codigo: codigo || undefined })
  }
  const handleExportar = () =>
    descargarExcel(codigo || undefined, filtroFecha.fecha_desde, filtroFecha.fecha_hasta)

  const codigosVisibles = useMemo(() => {
    const set = new Set(movimientos.map(m => m.codigo).filter(Boolean))
    return Array.from(set) as string[]
  }, [movimientos])

  const fmt  = (n: number) => n.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const fmtS = (n: number) => `S/ ${(Math.round(n * 100) / 100).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

  if (!id) return (
    <div className="min-h-screen flex items-center justify-center font-mono text-[13px]"
      style={{ background: '#07101e', color: '#2a4a6a' }}
    >
      ID de procesamiento inválido.
    </div>
  )

  return (
    <div className="min-h-screen flex" style={{ background: '#07101e', color: '#c8ddef', fontFamily: "'Inter', -apple-system, sans-serif" }}>

      {/* ── Sidebar ── */}
      <Sidebar id={id} onNavigate={navigate} currentPath={location.pathname} />

      {/* ── Panel derecho ── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ── Topbar ── */}
        <header className="h-[80px] shrink-0 flex items-center justify-between px-8 gap-3 sticky top-0 z-30"
          style={{ borderBottom: '1px solid rgba(56,139,221,0.1)', background: '#080e1c' }}
        >
          <div>
            <h1 className="font-mono text-3xl font-bold leading-none tracking-[-0.02em] m-0" style={{ color: '#e2e8f0' }}>
              Kardex <span style={{ color: '#2563eb' }}>#{id}</span>
            </h1>
            <p className="text-[13px] mt-[6px]" style={{ color: '#1e3a5a' }}>
              {totalRegistros.toLocaleString('es-PE')} registros cargados
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {erroresIntegridad > 0 && (
              <span style={{ ...btnBase, background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', color: '#fbbf24', cursor: 'default' }}>
                ⚠ {erroresIntegridad} anomalía{erroresIntegridad > 1 ? 's' : ''}
              </span>
            )}
            <button type="button" onClick={() => setFiltrosAbiertos(v => !v)} style={{
              ...btnBase,
              background: filtrosAbiertos ? 'rgba(56,139,221,0.15)' : 'rgba(56,139,221,0.06)',
              border: filtrosAbiertos ? '1px solid rgba(56,139,221,0.35)' : '1px solid rgba(56,139,221,0.14)',
              color: filtrosAbiertos ? '#60a5fa' : '#2a5a8a',
            }}>
              <IconFilter /> Filtros
            </button>
            <button type="button" onClick={() => setMostrarSemaforo(v => !v)} style={{
              ...btnBase,
              background: mostrarSemaforo ? 'rgba(245,158,11,0.12)' : 'rgba(56,139,221,0.06)',
              border: mostrarSemaforo ? '1px solid rgba(245,158,11,0.28)' : '1px solid rgba(56,139,221,0.14)',
              color: mostrarSemaforo ? '#fbbf24' : '#2a5a8a',
            }}>
              <IconShield /> Verificación
            </button>
            <button type="button" onClick={handleExportar}
              disabled={exporting || movimientos.length === 0}
              style={{
                ...btnBase,
                background: 'linear-gradient(135deg,#1d4ed8,#1e3a8a)',
                border: 'none', color: '#e2e8f0',
                boxShadow: '0 2px 10px rgba(29,78,216,0.4)',
                opacity: (exporting || movimientos.length === 0) ? 0.4 : 1,
                cursor: (exporting || movimientos.length === 0) ? 'not-allowed' : 'pointer',
              }}
            >
              {exporting ? <IconSpinner /> : <IconDownload />} Exportar Excel
            </button>
          </div>
        </header>

        {/* ── Contenido scrolleable ── */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-7">

          {/* Alertas */}
          {alertas && <AlertaBanner alertas={alertas} erroresIntegridad={erroresIntegridad} />}

          {/* Métricas */}
          {metricas && (
            <div className="flex gap-4">
              <MetricCard label="Total registros" value={totalRegistros.toLocaleString('es-PE')} sub="movimientos"        color="#c8ddef" sparkColor="#3b82f6" borderColor="rgba(56,139,221,0.15)" />
              <MetricCard label="Total entradas"  value={fmtS(metricas.total_ent_costo)}   sub={`${fmt(metricas.total_ent_cantidad)} uds`}   color="#3b82f6" sparkColor="#3b82f6" borderColor="rgba(59,130,246,0.25)" />
              <MetricCard label="Total salidas"   value={fmtS(metricas.total_sal_costo)}   sub={`${fmt(metricas.total_sal_cantidad)} uds`}   color="#f87171" sparkColor="#ef4444" borderColor="rgba(239,68,68,0.25)"  />
              <MetricCard label="Saldo final"     value={fmtS(metricas.saldo_final_costo)} sub={`${fmt(metricas.saldo_final_cantidad)} uds`} color="#fbbf24" sparkColor="#f59e0b" borderColor="rgba(245,158,11,0.25)" />
            </div>
          )}

          {/* Filtros */}
          {filtrosAbiertos && (
            <div style={{ background: '#0d1525', border: '1px solid rgba(56,139,221,0.18)', borderRadius: 10, padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                <span style={{ color: '#3b82f6' }}><IconFilter /></span>
                <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: '#2a5a8a', whiteSpace: 'nowrap' as const }}>
                  Filtrar
                </span>
              </div>
              {/* Separador */}
              <div style={{ width: 1, height: 30, background: 'rgba(56,139,221,0.15)', flexShrink: 0 }} />
              {/* Código */}
              <div style={{ flexShrink: 0, width: 300 }}>
                <FiltroCodigo onBuscar={handleBuscarCodigo} disabled={loading} />
              </div>
              {/* Separador */}
              <div style={{ width: 1, height: 30, background: 'rgba(56,139,221,0.15)', flexShrink: 0 }} />
              {/* Fecha */}
              <div style={{ flex: 1 }}>
                <FiltroFecha filtro={filtroFecha} onChange={handleCambiarFecha} disabled={loading} />
              </div>
            </div>
          )}

          {/* Badges */}
          {codigosVisibles.length > 0 && <BadgeProducto codigos={codigosVisibles} />}

          {/* Error */}
          {error && (
            <div className="flex items-start gap-2 rounded-lg p-[10px_14px] font-mono text-xs text-[#fca5a5]"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
            >
              ✕ {error}
            </div>
          )}

          {/* Tabla */}
          <div className="rounded-[10px] overflow-hidden" style={{ background: '#0d1525', border: '1px solid rgba(56,139,221,0.1)' }}>

            {/* Toolbar tabla */}
            <div className="flex items-center justify-between px-3.5 py-2.5" style={{ borderBottom: '1px solid rgba(56,139,221,0.08)', background: 'rgba(56,139,221,0.03)' }}>
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-3 bg-blue-500 rounded-sm" />
                <span className="font-mono text-[9px] font-bold tracking-[.16em] uppercase text-[#1e3a5a]">Movimientos</span>
                <span className="font-mono text-[11px] px-2 py-px rounded-full text-[#60a5fa]"
                  style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)' }}
                >
                  {movimientos.length.toLocaleString('es-PE')}
                </span>
              </div>
              <div className="flex items-center gap-3.5">
                {mostrarSemaforo && (
                  <div className="flex items-center gap-3 text-[10px] text-[#1e3a5a]">
                    {[{ color: '#22c55e', label: 'OK' }, { color: '#f59e0b', label: 'Error B' }, { color: '#ef4444', label: 'Error A' }, { color: '#4a4a6a', label: 'A+B' }].map(item => (
                      <span key={item.label} className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: item.color }} />
                        {item.label}
                      </span>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full inline-block bg-green-500" />
                  <span className="text-[10px] text-[#1e3a5a]">En línea</span>
                </div>
              </div>
            </div>

            {/* Body */}
            {loading ? (
              <div className="flex items-center justify-center py-14 gap-2.5 text-[#1e3a5a]">
                <IconSpinner />
                <span className="font-mono text-xs">Cargando movimientos...</span>
              </div>
            ) : (
              <KardexTable movimientos={movimientos} mostrarSemaforo={mostrarSemaforo} />
            )}

            {/* Footer tabla */}
            {movimientos.length > 0 && (
              <div className="px-3.5 py-[7px]" style={{ borderTop: '1px solid rgba(56,139,221,0.08)', background: 'rgba(56,139,221,0.02)' }}>
                <p className="font-mono text-[10px] text-[#1e3a5a]">
                  Mostrando {movimientos.length.toLocaleString('es-PE')} de {totalRegistros.toLocaleString('es-PE')} registros
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}