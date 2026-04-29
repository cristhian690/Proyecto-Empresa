import { getSemaforoColor, getSemaforoLabel } from '../lib/utils'
import type { SemaforoTipo } from '../lib/utils'

interface SemaforoProps {
  valor: SemaforoTipo
  mostrarLabel?: boolean
}

export default function Semaforo({ valor, mostrarLabel = false }: SemaforoProps) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium ${getSemaforoColor(valor)}`}>
      {valor}
      {mostrarLabel && <span>{getSemaforoLabel(valor)}</span>}
    </span>
  )
}