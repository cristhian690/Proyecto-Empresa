import { useState } from 'react'

interface FiltroCodigoProps {
  onBuscar:  (codigo: string) => void
  disabled?: boolean
}

const IconSearch = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)
const IconX = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

export default function FiltroCodigo({ onBuscar, disabled = false }: FiltroCodigoProps) {
  const [valor,   setValor]   = useState('')
  const [focused, setFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onBuscar(valor.trim())
  }

  const handleLimpiar = () => {
    setValor('')
    onBuscar('')
  }

  const canSearch = !disabled && !!valor.trim()

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      {/* Input con icono */}
      <div style={{ flex: 1, position: 'relative' }}>
        <span style={{
          position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
          color: focused ? '#3b82f6' : '#2a5a8a', pointerEvents: 'none',
          transition: 'color 0.15s',
        }}>
          <IconSearch />
        </span>
        <input
          type="text"
          value={valor}
          onChange={e => setValor(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Código del producto…"
          disabled={disabled}
          style={{
            width: '100%', boxSizing: 'border-box',
            background: '#07101e',
            border: `1px solid ${focused ? 'rgba(59,130,246,0.5)' : 'rgba(56,139,221,0.2)'}`,
            borderRadius: 7,
            padding: '7px 30px 7px 30px',
            fontSize: 12, color: '#c8ddef',
            fontFamily: "'IBM Plex Mono', monospace",
            outline: 'none',
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'text',
            transition: 'border-color 0.15s, box-shadow 0.15s',
            boxShadow: focused ? '0 0 0 3px rgba(59,130,246,0.08)' : 'none',
          }}
        />
        {valor && !disabled && (
          <button
            type="button"
            onClick={handleLimpiar}
            style={{
              position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#2a5a8a', display: 'flex', alignItems: 'center', padding: 2, borderRadius: 3,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#f87171' }}
            onMouseLeave={e => { e.currentTarget.style.color = '#2a5a8a' }}
          >
            <IconX />
          </button>
        )}
      </div>

      {/* Botón buscar */}
      <button
        type="submit"
        disabled={!canSearch}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '7px 14px', borderRadius: 7, border: 'none',
          background: canSearch ? 'linear-gradient(135deg,#1d4ed8,#1e3a8a)' : 'rgba(56,139,221,0.1)',
          color: canSearch ? '#e2e8f0' : '#2a5a8a',
          fontSize: 12, fontWeight: 600,
          cursor: canSearch ? 'pointer' : 'not-allowed',
          fontFamily: "'Inter', sans-serif",
          boxShadow: canSearch ? '0 2px 8px rgba(29,78,216,0.3)' : 'none',
          transition: 'opacity 0.12s',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}
        onMouseEnter={e => { if (canSearch) e.currentTarget.style.opacity = '0.88' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
      >
        <IconSearch /> Buscar
      </button>
    </form>
  )
}
