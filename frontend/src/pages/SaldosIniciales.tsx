import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ModalSaldoInicial from '../components/ModalSaldoInicial'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

/* ── Types ───────────────────────────────────────────────────────────────────── */
interface Saldo {
  id:             number
  codigo:         string
  descripcion?:   string
  fecha:          string
  cantidad:       number
  costo_unitario: number
  costo_total:    number
}

/* ── Icons ───────────────────────────────────────────────────────────────────── */
const IconBox = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>
  </svg>
)
const IconGrid = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
  </svg>
)
const IconUpload = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
)
const IconHistory = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/>
  </svg>
)
const IconSaldos = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
)
const IconProducts = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
  </svg>
)
const IconPlus = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconPencil = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const IconTrash = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
    <path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const IconSpinner = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ animation: 'kspin 1s linear infinite' }}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.2"/>
    <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
    <style>{`@keyframes kspin{to{transform:rotate(360deg)}}`}</style>
  </svg>
)

/* ── Sidebar ─────────────────────────────────────────────────────────────────── */
const Sidebar = ({ onNavigate, currentPath }: {
  onNavigate:  (p: string) => void
  currentPath: string
}) => {
  const navItem = (label: string, icon: React.ReactNode, path: string, active: boolean) => (
    <button
      key={label}
      type="button"
      onClick={() => onNavigate(path)}
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
        padding: '6px 10px', borderRadius: 6, border: 'none',
        background: active ? 'rgba(56,139,221,0.15)' : 'transparent',
        color: active ? '#60a5fa' : '#4a6a8a',
        fontSize: 12, fontWeight: active ? 600 : 400,
        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' as const,
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      <span style={{ color: active ? '#60a5fa' : '#3a5a7a', flexShrink: 0 }}>{icon}</span>
      {label}
      {active && <span style={{ marginLeft: 'auto', width: 3, height: 14, background: '#3b82f6', borderRadius: 2 }} />}
    </button>
  )

  const sectionLabel = (text: string) => (
    <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: '.15em', color: '#1e3a5a', textTransform: 'uppercase' as const, padding: '6px 10px 4px' }}>
      {text}
    </div>
  )

  return (
    <aside style={{
      width: 158, flexShrink: 0, background: '#080e1c',
      borderRight: '1px solid rgba(56,139,221,0.1)',
      padding: '12px 10px', display: 'flex', flexDirection: 'column',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 4px 16px' }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
          <IconBox />
        </div>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 700, color: '#e2e8f0', letterSpacing: '.08em' }}>KARDEX</div>
          <div style={{ fontSize: 9, color: '#2a4a6a', letterSpacing: '.1em' }}>Sistema CPP</div>
        </div>
      </div>

      {sectionLabel('Principal')}
      {navItem('Dashboard',  <IconGrid />,    '/',           false)}
      {navItem('Procesar',   <IconUpload />,  '/',           currentPath === '/')}
      {navItem('Actividad',  <IconHistory />, '/historial',  currentPath === '/historial')}

      <div style={{ height: 1, background: 'rgba(56,139,221,0.08)', margin: '10px 0' }} />

      {sectionLabel('Sistema')}
      {navItem('Saldos',    <IconSaldos />,   '/saldos',     currentPath === '/saldos')}
      {navItem('Productos', <IconProducts />, '/',           false)}
    </aside>
  )
}

/* ── Formatters ──────────────────────────────────────────────────────────────── */
const fmt2 = (n: number) =>
  (Math.round(n * 100) / 100).toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const fmtS = (n: number) => `S/ ${fmt2(n)}`

/* ── Page ────────────────────────────────────────────────────────────────────── */
export default function SaldosIniciales() {
  const navigate = useNavigate()
  const location = useLocation()

  const [saldos,        setSaldos]        = useState<Saldo[]>([])
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)
  const [modalOpen,     setModalOpen]     = useState(false)
  const [saldoEditando, setSaldoEditando] = useState<Saldo | null>(null)
  const [mensaje,       setMensaje]       = useState<string | null>(null)
  const [hoveredRow,    setHoveredRow]    = useState<number | null>(null)

  const fetchSaldos = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/v1/saldos/`)
      if (!res.ok) throw new Error('Error al cargar saldos')
      setSaldos(await res.json())
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchSaldos() }, [])

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Seguro que deseas eliminar este saldo?')) return
    try {
      const res  = await fetch(`${API}/api/v1/saldos/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.detail || 'Error al eliminar')
      if (data?.advertencia) alert(data.advertencia)
      setMensaje(data?.mensaje || 'Eliminado correctamente')
      fetchSaldos()
    } catch (e) {
      alert((e as Error).message)
    }
  }

  const handleGuardado = (_codigo: string) => {
    setModalOpen(false)
    setSaldoEditando(null)
    fetchSaldos()
  }

  const abrirNuevo = () => { setSaldoEditando(null); setModalOpen(true) }
  const abrirEditar = (s: Saldo) => { setSaldoEditando(s); setModalOpen(true) }

  /* ── th helpers ── */
  const thGroup = (label: string, accent: string, bg: string, cols: number) => (
    <th
      colSpan={cols}
      style={{
        padding: '7px 14px', fontSize: 9, fontWeight: 700,
        letterSpacing: '.14em', textTransform: 'uppercase' as const,
        color: accent, background: bg,
        borderBottom: `2px solid ${accent}40`,
        textAlign: 'left' as const,
      }}
    >
      {label}
    </th>
  )

  const thSub = (label: string, align: 'left' | 'right' = 'left') => (
    <th style={{
      padding: '7px 14px', fontSize: 10, fontWeight: 600,
      letterSpacing: '.08em', textTransform: 'uppercase' as const,
      color: '#2a4a6a', background: '#0a1020',
      borderBottom: '1px solid rgba(56,139,221,0.1)',
      textAlign: align, whiteSpace: 'nowrap' as const,
      fontFamily: "'Inter', sans-serif",
    }}>
      {label}
    </th>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#07101e', fontFamily: "'Inter', sans-serif", color: '#c8ddef' }}>

      <Sidebar onNavigate={navigate} currentPath={location.pathname} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* ── Topbar ── */}
        <header style={{
          height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', flexShrink: 0,
          borderBottom: '1px solid rgba(56,139,221,0.1)', background: '#080e1c',
        }}>
          <div>
            <h1 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 20, fontWeight: 700, color: '#e2e8f0', margin: 0, lineHeight: 1 }}>
              Saldos Iniciales
            </h1>
            <p style={{ fontSize: 12, color: '#1e3a5a', marginTop: 5 }}>
              {loading ? 'Cargando...' : `${saldos.length.toLocaleString('es-PE')} registros — stock base para cálculo CPP`}
            </p>
          </div>

          <button
            type="button"
            onClick={abrirNuevo}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '10px 20px', borderRadius: 8, border: 'none',
              background: 'linear-gradient(135deg,#1d4ed8,#1e3a8a)',
              color: '#e2e8f0', fontSize: 13, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              boxShadow: '0 2px 12px rgba(29,78,216,0.4)',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88' }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
          >
            <IconPlus /> Nuevo saldo
          </button>
        </header>

        {/* ── Contenido ── */}
        <div style={{ flex: 1, padding: '32px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Toast éxito */}
          {mensaje && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 8, padding: '12px 18px',
              fontSize: 13, color: '#4ade80', fontFamily: "'IBM Plex Mono', monospace",
            }}>
              <span>✓ {mensaje}</span>
              <button onClick={() => setMensaje(null)} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', fontSize: 16, padding: '0 4px' }}>×</button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: 8,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 8, padding: '10px 14px',
              fontSize: 12, color: '#fca5a5', fontFamily: "'IBM Plex Mono', monospace",
            }}>
              ✕ {error}
            </div>
          )}

          {/* ── Tabla container ── */}
          <div style={{ borderRadius: 10, overflow: 'hidden', background: '#0d1525', border: '1px solid rgba(56,139,221,0.1)' }}>

            {/* Toolbar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 16px',
              borderBottom: '1px solid rgba(56,139,221,0.08)',
              background: 'rgba(56,139,221,0.03)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 2, height: 12, background: '#3b82f6', borderRadius: 2 }} />
                <span style={{ fontFamily: 'monospace', fontSize: 9, fontWeight: 700, letterSpacing: '.16em', textTransform: 'uppercase' as const, color: '#1e3a5a' }}>
                  Registros
                </span>
                <span style={{
                  fontFamily: 'monospace', fontSize: 11, padding: '1px 8px', borderRadius: 999, color: '#60a5fa',
                  background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)',
                }}>
                  {saldos.length.toLocaleString('es-PE')}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
                <span style={{ fontSize: 10, color: '#1e3a5a' }}>En línea</span>
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '56px 0', color: '#1e3a5a' }}>
                <IconSpinner />
                <span style={{ fontFamily: 'monospace', fontSize: 12 }}>Cargando saldos...</span>
              </div>
            )}

            {/* Vacío */}
            {!loading && saldos.length === 0 && (
              <div style={{ padding: '56px 0', textAlign: 'center', color: '#1e3a5a', fontFamily: 'monospace', fontSize: 12 }}>
                No hay saldos iniciales registrados.
              </div>
            )}

            {/* Tabla */}
            {!loading && saldos.length > 0 && (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                  <colgroup>
                    <col style={{ width: 100 }} />
                    <col style={{ width: 200 }} />
                    <col style={{ width: 110 }} />
                    <col style={{ width: 110 }} />
                    <col style={{ width: 130 }} />
                    <col style={{ width: 130 }} />
                    <col style={{ width: 130 }} />
                  </colgroup>

                  <thead>
                    {/* Grupos */}
                    <tr>
                      {thGroup('Producto',  '#60a5fa', 'rgba(59,130,246,0.06)',  3)}
                      {thGroup('Stock',     '#34d399', 'rgba(52,211,153,0.06)',  1)}
                      {thGroup('Costo',     '#fbbf24', 'rgba(251,191,36,0.06)', 2)}
                      {thGroup('Acciones',  '#6b7280', 'rgba(107,114,128,0.04)', 1)}
                    </tr>
                    {/* Sub-headers */}
                    <tr>
                      {thSub('Código')}
                      {thSub('Descripción')}
                      {thSub('Fecha')}
                      {thSub('Cantidad', 'right')}
                      {thSub('Costo Unit.', 'right')}
                      {thSub('Costo Total', 'right')}
                      {thSub('Acciones')}
                    </tr>
                  </thead>

                  <tbody>
                    {saldos.map(s => {
                      const hovered = hoveredRow === s.id
                      const rowBg   = hovered ? 'rgba(56,139,221,0.07)' : 'transparent'
                      const td = (content: React.ReactNode, align: 'left' | 'right' = 'left', mono = false): React.ReactNode => (
                        <td style={{
                          padding: '10px 14px',
                          color: '#c8ddef',
                          borderBottom: '1px solid rgba(56,139,221,0.06)',
                          background: rowBg,
                          textAlign: align,
                          fontFamily: mono ? "'IBM Plex Mono', monospace" : 'inherit',
                          fontSize: mono ? 11 : 12,
                          transition: 'background 0.1s',
                        }}>
                          {content}
                        </td>
                      )

                      return (
                        <tr
                          key={s.id}
                          onMouseEnter={() => setHoveredRow(s.id)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          {td(
                            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 700, color: '#60a5fa' }}>
                              {s.codigo}
                            </span>
                          )}
                          {td(s.descripcion || <span style={{ color: '#2a4a6a' }}>—</span>)}
                          {td(s.fecha, 'left', true)}
                          {td(
                            <span style={{ color: '#34d399', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
                              {fmt2(s.cantidad)}
                            </span>,
                            'right'
                          )}
                          {td(
                            <span style={{ color: '#fbbf24', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
                              {fmtS(s.costo_unitario)}
                            </span>,
                            'right'
                          )}
                          {td(
                            <span style={{ color: '#fbbf24', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, fontWeight: 600 }}>
                              {fmtS(s.costo_total)}
                            </span>,
                            'right'
                          )}
                          <td style={{
                            padding: '8px 14px',
                            borderBottom: '1px solid rgba(56,139,221,0.06)',
                            background: rowBg,
                            transition: 'background 0.1s',
                          }}>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button
                                type="button"
                                onClick={() => abrirEditar(s)}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 5,
                                  padding: '5px 10px', borderRadius: 6,
                                  border: '1px solid rgba(59,130,246,0.3)',
                                  background: 'rgba(59,130,246,0.1)',
                                  color: '#60a5fa', fontSize: 11, fontWeight: 600,
                                  cursor: 'pointer', fontFamily: 'inherit',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.22)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(59,130,246,0.1)' }}
                              >
                                <IconPencil /> Editar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleEliminar(s.id)}
                                style={{
                                  display: 'inline-flex', alignItems: 'center', gap: 5,
                                  padding: '5px 10px', borderRadius: 6,
                                  border: '1px solid rgba(239,68,68,0.25)',
                                  background: 'rgba(239,68,68,0.08)',
                                  color: '#f87171', fontSize: 11, fontWeight: 600,
                                  cursor: 'pointer', fontFamily: 'inherit',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.18)' }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)' }}
                              >
                                <IconTrash /> Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Footer */}
            {!loading && saldos.length > 0 && (
              <div style={{
                padding: '7px 16px',
                borderTop: '1px solid rgba(56,139,221,0.08)',
                background: 'rgba(56,139,221,0.02)',
              }}>
                <p style={{ fontFamily: 'monospace', fontSize: 10, color: '#1e3a5a', margin: 0 }}>
                  {saldos.length.toLocaleString('es-PE')} saldo{saldos.length !== 1 ? 's' : ''} registrado{saldos.length !== 1 ? 's' : ''}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Modal */}
      <ModalSaldoInicial
        open={modalOpen}
        onClose={() => { setModalOpen(false); setSaldoEditando(null) }}
        onGuardado={handleGuardado}
        codigoInicial={saldoEditando?.codigo}
      />
    </div>
  )
}
