import type { ReactNode } from 'react'
import {
  IconBox, IconGrid, IconUpload, IconHistory,
  IconList, IconShield, IconDownload,
  IconSaldos, IconProducts,
} from './icons'

interface SidebarProps {
  id:          number
  onNavigate:  (path: string) => void
  currentPath: string
}

export default function Sidebar({ id, onNavigate, currentPath }: SidebarProps) {
  const navItem = (label: string, icon: ReactNode, path: string, active: boolean) => (
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
        transition: 'background 0.1s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}
    >
      <span style={{ color: active ? '#60a5fa' : '#3a5a7a', flexShrink: 0 }}>{icon}</span>
      {label}
      {active && (
        <span style={{ marginLeft: 'auto', width: 3, height: 14, background: '#3b82f6', borderRadius: 2, flexShrink: 0 }} />
      )}
    </button>
  )

  const sectionLabel = (text: string) => (
    <div style={{
      fontSize: 9, fontWeight: 700, letterSpacing: '.15em', color: '#1e3a5a',
      textTransform: 'uppercase' as const, padding: '6px 10px 4px',
    }}>
      {text}
    </div>
  )

  const divider = (
    <div style={{ height: 1, background: 'rgba(56,139,221,0.08)', margin: '10px 0' }} />
  )

  return (
    <aside style={{
      width: 158, flexShrink: 0,
      background: '#080e1c',
      borderRight: '1px solid rgba(56,139,221,0.1)',
      padding: '12px 10px',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 4px 16px' }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7,
          background: 'linear-gradient(135deg,#2563eb,#1d4ed8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white', flexShrink: 0,
        }}>
          <IconBox />
        </div>
        <div>
          <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 700, color: '#e2e8f0', letterSpacing: '.08em' }}>
            KARDEX
          </div>
          <div style={{ fontSize: 9, color: '#2a4a6a', letterSpacing: '.1em' }}>
            Sistema CPP
          </div>
        </div>
      </div>

      {/* Principal */}
      {sectionLabel('Principal')}
      {navItem('Dashboard',  <IconGrid />,    `/kardex/${id}`, currentPath === `/kardex/${id}`)}
      {navItem('Procesar',   <IconUpload />,  '/',             currentPath === '/')}
      {navItem('Actividad',  <IconHistory />, '/historial',    currentPath === '/historial')}

      {divider}

      {/* Análisis */}
      {sectionLabel('Análisis')}
      {navItem('Movimientos',  <IconList />,     `/kardex/${id}`, currentPath.startsWith('/kardex/'))}
      {navItem('Verificación', <IconShield />,   `/kardex/${id}`, false)}
      {navItem('Exportar',     <IconDownload />, `/kardex/${id}`, false)}

      {divider}

      {/* Sistema */}
      {sectionLabel('Sistema')}
      {navItem('Saldos',    <IconSaldos />,   '/saldos',       currentPath === '/saldos')}
      {navItem('Productos', <IconProducts />, `/kardex/${id}`, false)}
    </aside>
  )
}
