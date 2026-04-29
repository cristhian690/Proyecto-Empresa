// ── Formateo de números ────────────────────────────────────────────────────────
export const fmtCantidad = (n: number) =>
  new Intl.NumberFormat('es-PE', {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  }).format(n)

export const fmtCosto = (n: number) =>
  new Intl.NumberFormat('es-PE', {
    style:                 'currency',
    currency:              'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)

export const fmtFecha = (fecha: string) => {
  try {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-PE', {
      day:   '2-digit',
      month: '2-digit',
      year:  'numeric',
    })
  } catch {
    return fecha
  }
}

// ── Clases CSS condicionales (sin clsx) ───────────────────────────────────────
export const cn = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(' ')