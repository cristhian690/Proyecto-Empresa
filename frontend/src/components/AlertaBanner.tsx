import type { AlertasProcesamiento } from '../types'

interface AlertaBannerProps {
  alertas:           AlertasProcesamiento
  erroresIntegridad: number
}

export default function AlertaBanner({ alertas, erroresIntegridad }: AlertaBannerProps) {
  const hayAlertas =
    alertas.sin_saldo_inicial.length > 0 ||
    alertas.saldo_negativo.length    > 0 ||
    alertas.duplicados.length        > 0 ||
    erroresIntegridad                > 0

  if (!hayAlertas) {
    return (
      <div className="flex items-center gap-2 bg-green-50 border border-green-200
                      text-green-800 rounded-xl px-4 py-3 text-sm">
        <span className="text-base">✅</span>
        <span>Verificación de integridad correcta — todos los registros son consistentes.</span>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {alertas.duplicados.length > 0 && (
        <Banner
          tipo="error"
          icono="❌"
          titulo="Códigos duplicados en múltiples archivos"
          items={alertas.duplicados}
        />
      )}

      {alertas.saldo_negativo.length > 0 && (
        <Banner
          tipo="error"
          icono="❌"
          titulo={`Saldo negativo detectado en ${alertas.saldo_negativo.length} producto(s)`}
          items={alertas.saldo_negativo}
          descripcion="Hay más salidas que stock disponible. Haz clic en una fila para ir a ella."
          clickeable
        />
      )}

      {alertas.sin_saldo_inicial.length > 0 && (
        <Banner
          tipo="warning"
          icono="⚠️"
          titulo="Productos sin saldo inicial (calculados desde cero)"
          items={alertas.sin_saldo_inicial}
          descripcion="Haz clic en un código para ir a la primera fila afectada."
          clickeable
        />
      )}

      {erroresIntegridad > 0 && (
        <Banner
          tipo="warning"
          icono="⚠️"
          titulo={`${erroresIntegridad} fila(s) con anomalías de integridad`}
          descripcion='Activa "Mostrar verificación" en la tabla para ver el detalle.'
        />
      )}
    </div>
  )
}

// ── Sub-componente Banner ────────────────────────────────────────────────────
interface BannerProps {
  tipo:         'error' | 'warning' | 'info'
  icono:        string
  titulo:       string
  items?:       string[]
  descripcion?: string
  clickeable?:  boolean
}

function Banner({ tipo, icono, titulo, items, descripcion, clickeable }: BannerProps) {
  const estilos = {
    error:   'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info:    'bg-blue-50 border-blue-200 text-blue-800',
  }

  const irAFila = (codigo: string) => {
    // Llama a la función expuesta por KardexTable en window
    const fn = (window as any).__kardexIrAFila
    if (typeof fn === 'function') fn(codigo)
  }

  return (
    <div className={`flex gap-3 border rounded-xl px-4 py-3 text-sm ${estilos[tipo]}`}>
      <span className="text-base shrink-0 mt-0.5">{icono}</span>
      <div className="min-w-0">
        <p className="font-semibold">{titulo}</p>
        {descripcion && (
          <p className="text-xs mt-0.5 opacity-75">{descripcion}</p>
        )}
        {items && items.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {items.map((item) => (
              <span
                key={item}
                onClick={clickeable ? () => irAFila(item) : undefined}
                title={clickeable ? 'Clic para ir a la fila' : undefined}
                className={[
                  'inline-block bg-white bg-opacity-60 border border-current',
                  'rounded-full px-2 py-0.5 text-xs font-mono',
                  'select-none',
                  clickeable
                    ? 'cursor-pointer hover:bg-opacity-90 hover:scale-105 transition-transform active:scale-95'
                    : '',
                ].join(' ')}
              >
                {item}
                {clickeable && (
                  <span className="ml-1 opacity-50" style={{ fontSize: 9 }}>↓</span>
                )}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}