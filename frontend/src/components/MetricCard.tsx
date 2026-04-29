// ── Sparkline ─────────────────────────────────────────────────────────────────
interface SparklineProps {
  color: string
}

export function Sparkline({ color }: SparklineProps) {
  const pts = [20, 35, 28, 50, 42, 60, 55, 70, 65, 80, 72, 88]
  const w = 90, h = 36
  const max = Math.max(...pts), min = Math.min(...pts)
  const xs = pts.map((_, i) => (i / (pts.length - 1)) * w)
  const ys = pts.map(p => h - ((p - min) / (max - min)) * h * 0.8 - h * 0.1)
  const d  = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ')

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="opacity-60">
      <path d={d} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ── MetricCard ────────────────────────────────────────────────────────────────
interface MetricCardProps {
  label:       string
  value:       string
  sub:         string
  color:       string
  sparkColor:  string
  borderColor: string
}

export default function MetricCard({ label, value, sub, color, sparkColor, borderColor }: MetricCardProps) {
  return (
    <div
      className="flex-1 rounded-[14px] p-[28px_30px] flex flex-col gap-1.5 relative overflow-hidden min-w-0"
      style={{ background: '#0d1525', border: `1px solid ${borderColor}` }}
    >
      <p className="font-mono text-[11px] font-bold tracking-[.16em] uppercase text-[#2a4a6a]">
        {label}
      </p>
      <p className="font-mono text-[40px] font-extrabold leading-none mt-1.5 tracking-[-0.02em]"
        style={{ color }}
      >
        {value}
      </p>
      <p className="font-mono text-[13px] text-[#1e3a5a] mt-1">
        {sub}
      </p>
      <div className="absolute right-4 bottom-4">
        <Sparkline color={sparkColor} />
      </div>
    </div>
  )
}