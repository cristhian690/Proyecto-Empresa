import { useRef, useState, useCallback } from 'react'

interface FileUploaderProps {
  label:        string
  accept?:      string
  multiple?:    boolean
  onChange:     (files: File[]) => void
  files?:       File[]
  disabled?:    boolean
  description?: string
}

export default function FileUploader({
  label,
  accept    = '.xlsx',
  multiple  = false,
  onChange,
  files     = [],
  disabled  = false,
  description,
}: FileUploaderProps) {
  const inputRef   = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleFiles = useCallback((incoming: FileList | null) => {
    if (!incoming) return
    const validos = Array.from(incoming).filter(f => f.name.endsWith('.xlsx'))
    if (validos.length > 0) onChange(validos)
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }, [disabled, handleFiles])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    if (!disabled) setDragging(true)
  }

  const handleDragLeave = () => setDragging(false)

  const handleClick = () => {
    if (!disabled) inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files)
    e.target.value = ''
  }

  const eliminarArchivo = (index: number) => {
    onChange(files.filter((_, i) => i !== index))
  }

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <p style={{ fontSize: 12, fontWeight: 600, color: '#c8ddef', marginBottom: 8 }}>{label}</p>
      )}

      {/* Zona de drop */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        style={{
          border: `2px dashed ${dragging ? 'rgba(59,130,246,0.6)' : 'rgba(56,139,221,0.22)'}`,
          borderRadius: 10,
          padding: '32px 24px',
          textAlign: 'center',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: dragging ? 'rgba(59,130,246,0.08)' : 'rgba(56,139,221,0.03)',
          opacity: disabled ? 0.5 : 1,
          transition: 'border-color 0.15s, background 0.15s',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
          <svg
            width="40" height="40" viewBox="0 0 24 24" fill="none"
            stroke={dragging ? '#3b82f6' : '#2a5a8a'} strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
        </div>
        <p style={{ fontSize: 14, color: '#4a7a9a', margin: 0, lineHeight: 1.4 }}>
          <span style={{ fontWeight: 600, color: '#3b82f6' }}>Haz clic para subir</span>{' '}o arrastra aquí
        </p>
        <p style={{ fontSize: 12, color: '#1e3a5a', marginTop: 6 }}>
          {description || 'Solo archivos .xlsx'}
        </p>
      </div>

      {/* Input oculto */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={handleChange}
        disabled={disabled}
      />

      {/* Lista de archivos seleccionados */}
      {files.length > 0 && (
        <ul style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', padding: 0 }}>
          {files.map((file, i) => (
            <li
              key={i}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.2)',
                borderRadius: 6,
                padding: '6px 10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" style={{ flexShrink: 0 }}>
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <span style={{ fontSize: 12, color: '#60a5fa', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {file.name}
                </span>
                <span style={{ fontSize: 11, color: '#2a5a8a', flexShrink: 0 }}>
                  ({(file.size / 1024).toFixed(0)} KB)
                </span>
              </div>

              {!disabled && (
                <button
                  onClick={(e) => { e.stopPropagation(); eliminarArchivo(i) }}
                  title="Eliminar"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: '#2a5a8a', marginLeft: 8, flexShrink: 0,
                    display: 'flex', alignItems: 'center', padding: 2,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#f87171' }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#2a5a8a' }}
                >
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
