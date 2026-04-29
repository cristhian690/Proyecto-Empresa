interface BadgeProductoProps {
  codigos: string[]
}

export default function BadgeProducto({ codigos }: BadgeProductoProps) {
  if (codigos.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {codigos.map((codigo) => (
        <span
          key={codigo}
          className="inline-flex items-center gap-1 bg-indigo-50 border border-indigo-200
                     text-indigo-700 text-xs font-semibold font-mono rounded-full px-3 py-1"
        >
          📦 {codigo}
        </span>
      ))}
    </div>
  )
}