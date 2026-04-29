import { useState, useEffect, useRef } from 'react'

interface SaldoPayload {
  codigo: string
  descripcion: string
  fecha: string
  cantidad: number
  costo_unitario: number
}

interface Props {
  open: boolean
  onClose: () => void
  onGuardado?: (codigo: string) => void
  codigoInicial?: string
}

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

async function guardarSaldo(payload: SaldoPayload) {
  const res = await fetch(`${API}/api/v1/saldos/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.detail ?? `Error ${res.status}`)
  return data
}

/* ══════════════════════════════════════════════════
   Iconos
══════════════════════════════════════════════════ */
const IconX = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
)
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
)
const IconSpinner = () => (
  <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
)
const IconSaldo = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
)

/* ══════════════════════════════════════════════════
   Componente Principal
══════════════════════════════════════════════════ */
export default function ModalSaldoInicial({ open, onClose, onGuardado, codigoInicial }: Props) {
  const hoy = new Date().toISOString().split('T')[0]

  const [codigo, setCodigo] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [fecha, setFecha] = useState(hoy)
  const [cantidad, setCantidad] = useState('')
  const [costoUnit, setCostoUnit] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [advertencia, setAdvertencia] = useState<string | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setCodigo(codigoInicial ?? '')
      setDescripcion('')
      setFecha(hoy)
      setCantidad('')
      setCostoUnit('')
      setError(null)
      setSuccess(false)
      setAdvertencia(null)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open, codigoInicial])

  const costoTotal = Number(cantidad || 0) * Number(costoUnit || 0)

  const valido = codigo.trim() && descripcion.trim() && Number(cantidad) > 0 && Number(costoUnit) > 0

  const handleGuardar = async () => {
    if (!valido || loading) return
    setLoading(true)
    setError(null)
    try {
      const res = await guardarSaldo({
        codigo: codigo.trim().toUpperCase(),
        descripcion: descripcion.trim(),
        fecha,
        cantidad: Number(cantidad),
        costo_unitario: Number(costoUnit),
      })
      setAdvertencia(res.advertencia ?? null)
      setSuccess(true)
      onGuardado?.(codigo.trim().toUpperCase())
      setTimeout(() => onClose(), 1200)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} className="modal-overlay">
      <style>{`
        .modal-overlay { position: fixed; inset: 0; z-index: 9999; background: rgba(4,10,24,0.82); display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); }
        .msaldo-input { width: 100%; background: rgba(13,21,37,0.9); border: 1px solid rgba(56,139,221,0.2); border-radius: 7px; padding: 10px 12px; font-family: 'IBM Plex Mono', monospace; color: #c8ddef; outline: none; box-sizing: border-box; }
        .msaldo-input:focus { border-color: rgba(59,130,246,0.55); }
      `}</style>

      <div style={{ width: 420, background: '#0d1525', border: '1px solid rgba(56,139,221,0.18)', borderTop: '2px solid #3b82f6', borderRadius: 12, padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#60a5fa' }}><IconSaldo /></div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0' }}>Agregar saldo inicial</div>
              <div style={{ fontSize: 11, color: '#1e3a5a' }}>Stock base para cálculo CPP</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#2a5a8a' }}><IconX /></button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Field label="Código">
            <input ref={inputRef} className="msaldo-input" value={codigo} onChange={e => setCodigo(e.target.value.toUpperCase())} />
          </Field>
          <Field label="Descripción">
            <input className="msaldo-input" value={descripcion} onChange={e => setDescripcion(e.target.value)} />
          </Field>
          <Field label="Fecha">
            <input type="date" className="msaldo-input" value={fecha} onChange={e => setFecha(e.target.value)} style={{ colorScheme: 'dark' }} />
          </Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <Field label="Cantidad"><input className="msaldo-input" type="number" value={cantidad} onChange={e => setCantidad(e.target.value)} /></Field>
            <Field label="Costo unitario"><input className="msaldo-input" type="number" value={costoUnit} onChange={e => setCostoUnit(e.target.value)} /></Field>
          </div>
          <div style={{ background: 'rgba(56,139,221,0.05)', border: '1px solid rgba(56,139,221,0.12)', borderRadius: 8, padding: '9px 12px', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: '#1e3a5a' }}>Costo total calculado</span>
            <span style={{ fontWeight: 700, color: '#60a5fa' }}>S/ {costoTotal.toFixed(3)}</span>
          </div>
        </div>

        {error && <Msg color="#fca5a5">✕ {error}</Msg>}
        {advertencia && <Msg color="#facc15">⚠ {advertencia}</Msg>}
        {success && <Msg color="#4ade80"><IconCheck /> Guardado correctamente</Msg>}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '7px 16px', borderRadius: 7, background: 'rgba(56,139,221,0.06)', border: '1px solid rgba(56,139,221,0.14)', color: '#2a5a8a', cursor: 'pointer' }}>Cancelar</button>
          <button 
            onClick={handleGuardar} 
            disabled={!valido || loading} 
            style={{ padding: '7px 18px', borderRadius: 7, background: 'linear-gradient(135deg,#1d4ed8,#1e3a8a)', color: '#e2e8f0', border: 'none', cursor: valido ? 'pointer' : 'not-allowed', opacity: valido ? 1 : 0.6 }}
          >
            {loading ? <IconSpinner /> : 'Guardar saldo'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: any) {
  return (
    <div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: '#1e3a5a', marginBottom: 5, fontFamily: "'IBM Plex Mono', monospace" }}>{label}</div>
      {children}
    </div>
  )
}

function Msg({ children, color }: any) {
  return (
    <div style={{ borderRadius: 7, padding: '8px 12px', fontSize: 12, color, display: 'flex', gap: 6, background: 'rgba(255,255,255,0.03)' }}>{children}</div>
  )
}