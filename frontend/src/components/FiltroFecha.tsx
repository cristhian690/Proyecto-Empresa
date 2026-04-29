import type { FiltroFecha, ModoFiltro } from '../types'

interface FiltroFechaProps {
  filtro:    FiltroFecha
  onChange:  (filtro: FiltroFecha) => void
  disabled?: boolean
}

const MESES = [
  'Enero','Febrero','Marzo','Abril','Mayo','Junio',
  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre',
]

const MODOS: { value: ModoFiltro; label: string }[] = [
  { value: 'anio_mes', label: 'Año / Mes'      },
  { value: 'exacta',   label: 'Fecha exacta'   },
  { value: 'rango',    label: 'Rango'           },
]

const añosDisponibles = () => {
  const actual = new Date().getFullYear()
  return Array.from({ length: 5 }, (_, i) => actual - i)
}

const ctrlStyle: React.CSSProperties = {
  background: '#07101e',
  border: '1px solid rgba(56,139,221,0.2)',
  borderRadius: 7,
  padding: '7px 10px',
  fontSize: 12, color: '#c8ddef',
  fontFamily: "'IBM Plex Mono', monospace",
  outline: 'none',
  colorScheme: 'dark' as const,
  cursor: 'pointer',
}

export default function FiltroFechaPanel({
  filtro,
  onChange,
  disabled = false,
}: FiltroFechaProps) {
  const set = (partial: Partial<FiltroFecha>) =>
    onChange({ ...filtro, ...partial })

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>

      {/* Tabs de modo */}
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        {MODOS.map(m => {
          const active = filtro.modo === m.value
          return (
            <button
              key={m.value}
              type="button"
              onClick={() => !disabled && set({ modo: m.value })}
              disabled={disabled}
              style={{
                padding: '6px 11px', borderRadius: 6,
                border: active ? '1px solid rgba(59,130,246,0.45)' : '1px solid rgba(56,139,221,0.15)',
                background: active ? 'rgba(59,130,246,0.18)' : 'rgba(56,139,221,0.05)',
                color: active ? '#60a5fa' : '#3a5a7a',
                fontSize: 11, fontWeight: active ? 700 : 500,
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontFamily: "'Inter', sans-serif",
                opacity: disabled ? 0.5 : 1,
                transition: 'all 0.12s',
                whiteSpace: 'nowrap' as const,
              }}
              onMouseEnter={e => { if (!active && !disabled) e.currentTarget.style.background = 'rgba(56,139,221,0.1)' }}
              onMouseLeave={e => { if (!active && !disabled) e.currentTarget.style.background = 'rgba(56,139,221,0.05)' }}
            >
              {m.label}
            </button>
          )
        })}
      </div>

      {/* Separador */}
      <div style={{ width: 1, height: 24, background: 'rgba(56,139,221,0.15)', flexShrink: 0 }} />

      {/* Controles según modo — todos en la misma línea */}
      {filtro.modo === 'anio_mes' && (
        <>
          <select
            value={filtro.anio ?? ''}
            onChange={e => set({ anio: e.target.value ? Number(e.target.value) : undefined })}
            disabled={disabled}
            style={{ ...ctrlStyle, opacity: disabled ? 0.5 : 1, minWidth: 80 }}
          >
            <option value="">Año</option>
            {añosDisponibles().map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select
            value={filtro.mes ?? ''}
            onChange={e => set({ mes: e.target.value ? Number(e.target.value) : undefined })}
            disabled={disabled || !filtro.anio}
            style={{ ...ctrlStyle, opacity: (disabled || !filtro.anio) ? 0.5 : 1, minWidth: 110 }}
          >
            <option value="">Mes</option>
            {MESES.map((m, i) => (
              <option key={i + 1} value={i + 1}>{m}</option>
            ))}
          </select>
        </>
      )}

      {filtro.modo === 'exacta' && (
        <input
          type="date"
          value={filtro.fecha_exacta ?? ''}
          onChange={e => set({ fecha_exacta: e.target.value || undefined })}
          disabled={disabled}
          style={{ ...ctrlStyle, opacity: disabled ? 0.5 : 1 }}
        />
      )}

      {filtro.modo === 'rango' && (
        <>
          <input
            type="date"
            value={filtro.fecha_desde ?? ''}
            onChange={e => set({ fecha_desde: e.target.value || undefined })}
            disabled={disabled}
            style={{ ...ctrlStyle, opacity: disabled ? 0.5 : 1 }}
          />
          <span style={{ fontSize: 11, color: '#2a5a8a', flexShrink: 0 }}>—</span>
          <input
            type="date"
            value={filtro.fecha_hasta ?? ''}
            onChange={e => set({ fecha_hasta: e.target.value || undefined })}
            disabled={disabled}
            style={{ ...ctrlStyle, opacity: disabled ? 0.5 : 1 }}
          />
        </>
      )}

    </div>
  )
}
