import type { Metricas } from '../types'

interface MetricasProps {
  metricas: Metricas
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-PE', { minimumFractionDigits: 3, maximumFractionDigits: 3 }).format(n)

const fmtS = (n: number) =>
  new Intl.NumberFormat('es-PE', {
    style:                 'currency',
    currency:              'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)

export default function MetricasPanel({ metricas }: MetricasProps) {
  const tarjetas = [
    {
      label:  'Cant. Entrada',
      valor:  fmt(metricas.total_ent_cantidad),
      sub:    fmtS(metricas.total_ent_costo),
      color:  'bg-blue-50 border-blue-200',
      texto:  'text-blue-700',
      icono:  '📥',
    },
    {
      label:  'Cant. Salida',
      valor:  fmt(metricas.total_sal_cantidad),
      sub:    fmtS(metricas.total_sal_costo),
      color:  'bg-orange-50 border-orange-200',
      texto:  'text-orange-700',
      icono:  '📤',
    },
    {
      label:  'Saldo Final Cant.',
      valor:  fmt(metricas.saldo_final_cantidad),
      sub:    fmtS(metricas.saldo_final_costo),
      color:  'bg-green-50 border-green-200',
      texto:  'text-green-700',
      icono:  '📦',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {tarjetas.map((t) => (
        <div
          key={t.label}
          className={`border rounded-xl px-4 py-3 ${t.color}`}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-base">{t.icono}</span>
            <span className={`text-xs font-semibold uppercase tracking-wide ${t.texto}`}>
              {t.label}
            </span>
          </div>
          <p className={`text-xl font-bold ${t.texto}`}>{t.valor}</p>
          <p className="text-xs text-gray-500 mt-0.5">{t.sub}</p>
        </div>
      ))}
    </div>
  )
}