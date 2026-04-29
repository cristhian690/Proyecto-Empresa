import { useState, useMemo, useEffect, useRef } from "react";
import type { KardexRow } from "../types";

interface KardexTableProps {
  movimientos:     KardexRow[];
  mostrarSemaforo?: boolean;
}

// ── Formateadores ─────────────────────────────────────────────────────────────
const fmt2 = (n: number) =>
  new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const fmt4 = (n: number) =>
  new Intl.NumberFormat("es-PE", { minimumFractionDigits: 4, maximumFractionDigits: 4 }).format(n);

const fmtFecha = (fecha: string) => {
  try {
    return new Date(fecha + "T00:00:00").toLocaleDateString("es-PE", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  } catch {
    return fecha;
  }
};

const SEMAFORO_COLOR: Record<string, string> = {
  "🟢": "#22c55e",
  "🟡": "#f59e0b",
  "🔴": "#ef4444",
  "⚫": "#64748b",
};

const FILAS_POR_PAGINA = 100;

// ── Componente principal ──────────────────────────────────────────────────────
export default function KardexTable({ movimientos, mostrarSemaforo = false }: KardexTableProps) {
  const [pagina,     setPagina]     = useState(1);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const firstErrorRef = useRef<HTMLTableRowElement | null>(null);
  const autoPageRef   = useRef(false);

  const primerErrorIndex = useMemo(() =>
    movimientos.findIndex(m => m.error_a || m.error_b || m.saldo_negativo),
    [movimientos]
  );

  useEffect(() => {
    if (primerErrorIndex === -1) return;
    autoPageRef.current = true;
    setPagina(Math.floor(primerErrorIndex / FILAS_POR_PAGINA) + 1);
  }, [primerErrorIndex]);

  useEffect(() => {
    if (!autoPageRef.current) return;
    autoPageRef.current = false;
    firstErrorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [pagina]);

  const totalPaginas = Math.ceil(movimientos.length / FILAS_POR_PAGINA);

  const filas = useMemo(() =>
    movimientos.slice((pagina - 1) * FILAS_POR_PAGINA, pagina * FILAS_POR_PAGINA),
    [movimientos, pagina]
  );

  if (movimientos.length === 0) {
    return (
      <div style={{ padding: "52px 0", textAlign: "center" }}>
        <div style={{ fontSize: 30, marginBottom: 8 }}>📭</div>
        <p style={{ fontSize: 13, color: "#1e3a5a", fontFamily: "'Inter', sans-serif" }}>
          Sin registros para mostrar
        </p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}>
      <div style={{ overflowX: "auto" }}>
        <table style={{
          borderCollapse: "separate",
          borderSpacing: 0,
          fontSize: 11.5,
          tableLayout: "fixed",
          width: "100%",
          minWidth: mostrarSemaforo ? 1340 : 1300,
        }}>

          {/* ── Anchos de columna ── */}
          <colgroup>
            {mostrarSemaforo && <col style={{ width: 38 }} />}
            <col style={{ width: 46 }} />
            <col style={{ width: 82 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 42 }} />
            <col style={{ width: 62 }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 100 }} />
            <col style={{ width: 78 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 78 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 82 }} />
            <col style={{ width: 94 }} />
            <col style={{ width: 94 }} />
          </colgroup>

          <thead>
            {/* Fila 1 — Grupos */}
            <tr>
              {mostrarSemaforo && <th style={thEmpty} />}
              <th style={thEmpty} />
              <th style={thEmpty} />
              <th colSpan={4} style={thGroup("#1d4ed8", "rgba(29,78,216,0.12)")}>Comprobante</th>
              <th style={thGroup("#0d9488", "rgba(13,148,136,0.12)")}>Tipo de Operación</th>
              <th colSpan={3} style={thGroup("#16a34a", "rgba(22,163,74,0.12)")}>Entradas</th>
              <th colSpan={3} style={thGroup("#dc2626", "rgba(220,38,38,0.12)")}>Salidas</th>
              <th colSpan={3} style={thGroup("#2563eb", "rgba(37,99,235,0.15)")}>Saldo Final</th>
            </tr>

            {/* Fila 2 — Sub-cabeceras */}
            <tr>
              {mostrarSemaforo && <th style={thSub("center")}>Est.</th>}
              <th style={thSub("center")}>#</th>
              <th style={thSub("left")}>Código</th>

              <th style={thSub("left")}>Fecha</th>
              <th style={thSub("center")}>TC</th>
              <th style={thSub("left")}>Serie</th>
              <th style={thSub("left")}>Número</th>

              <th style={thSub("left")}>Operación</th>

              <th style={thSub("right")}>Cantidad</th>
              <th style={thSub("right")}>C. Unit.</th>
              <th style={thSub("right")}>Total</th>

              <th style={thSub("right")}>Cantidad</th>
              <th style={thSub("right")}>C. Unit.</th>
              <th style={thSub("right")}>Total</th>

              <th style={thSub("right")}>Cantidad</th>
              <th style={thSub("right")}>C. Unit.</th>
              <th style={thSub("right")}>Total</th>
            </tr>
          </thead>

          <tbody>
            {filas.map((row, i) => {
              const globalIndex = (pagina - 1) * FILAS_POR_PAGINA + i;
              const esError     = globalIndex === primerErrorIndex;
              const semaforo    = row.semaforo;
              const tieneError  = semaforo !== "🟢";
              const isHovered   = hoveredRow === row.id;
              const semaColor   = SEMAFORO_COLOR[semaforo] ?? "#22c55e";

              let rowBg: string;
              if (esError)       rowBg = "rgba(245,158,11,0.1)";
              else if (isHovered) rowBg = "rgba(56,139,221,0.08)";
              else if (tieneError) rowBg = "rgba(239,68,68,0.04)";
              else if (i % 2 !== 0) rowBg = "rgba(56,139,221,0.02)";
              else rowBg = "transparent";

              return (
                <tr
                  key={row.id}
                  ref={esError ? firstErrorRef : null}
                  onMouseEnter={() => setHoveredRow(row.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    background: rowBg,
                    borderBottom: "1px solid rgba(56,139,221,0.055)",
                    borderLeft: tieneError
                      ? `3px solid ${semaColor}`
                      : "3px solid transparent",
                    transition: "background 0.1s",
                  }}
                >
                  {/* Semáforo — dot coloreado */}
                  {mostrarSemaforo && (
                    <td style={{ ...tdBase("center"), padding: "0 4px" }}>
                      <span style={{
                        display: "inline-block",
                        width: 8, height: 8, borderRadius: "50%",
                        background: semaColor,
                        boxShadow: `0 0 5px ${semaColor}99`,
                        flexShrink: 0,
                      }} />
                    </td>
                  )}

                  {/* # */}
                  <td style={{ ...tdBase("right"), color: "#1e3a5a", fontSize: 10.5 }}>
                    {row.fila}
                  </td>

                  {/* Código */}
                  <td style={{ ...tdBase("left"), color: "#60a5fa", fontWeight: 700, letterSpacing: "0.02em" }}>
                    {row.codigo}
                  </td>

                  {/* Fecha */}
                  <td style={{ ...tdBase("left"), color: "#8ba8c4" }}>
                    {fmtFecha(row.fecha)}
                  </td>

                  {/* Tipo comprobante */}
                  <td style={{ ...tdBase("center"), color: "#3a6080" }}>
                    {row.tipo_comprobante}
                  </td>

                  {/* Serie */}
                  <td style={{ ...tdBase("left"), color: "#3a6080" }}>
                    {row.serie}
                  </td>

                  {/* Número */}
                  <td style={{ ...tdBase("left"), color: "#4a7a9a" }}>
                    {row.numero}
                  </td>

                  {/* Tipo operación — badge */}
                  <td style={{ ...tdBase("left") }}>
                    <OpBadge op={row.tipo_operacion} />
                  </td>

                  {/* Entradas */}
                  <td style={{ ...tdBase("right"), color: "#4ade80" }}>{fmt2(row.ent_cantidad)}</td>
                  <td style={{ ...tdBase("right"), color: "#34a863" }}>{fmt4(row.ent_costo_unit)}</td>
                  <td style={{ ...tdBase("right"), color: "#4ade80", fontWeight: 600 }}>{fmt2(row.ent_costo_total)}</td>

                  {/* Salidas */}
                  <td style={{ ...tdBase("right"), color: "#f87171" }}>{fmt2(row.sal_cantidad)}</td>
                  <td style={{ ...tdBase("right"), color: "#c05050" }}>{fmt4(row.sal_costo_unit)}</td>
                  <td style={{ ...tdBase("right"), color: "#f87171", fontWeight: 600 }}>{fmt2(row.sal_costo_total)}</td>

                  {/* Saldo final */}
                  <td style={{ ...tdBase("right"), color: "#93c5fd", fontWeight: 700 }}>{fmt2(row.saldo_cantidad)}</td>
                  <td style={{ ...tdBase("right"), color: "#5a8ab0" }}>{fmt4(row.saldo_costo_unit)}</td>
                  <td style={{ ...tdBase("right"), color: "#93c5fd", fontWeight: 700 }}>{fmt2(row.saldo_costo_total)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Paginación ── */}
      {totalPaginas > 1 && (
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderTop: "1px solid rgba(56,139,221,0.08)",
          background: "rgba(56,139,221,0.02)",
        }}>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            color: "#2a5080",
          }}>
            Página{" "}
            <strong style={{ color: "#60a5fa" }}>{pagina}</strong>
            {" "}de {totalPaginas}
            <span style={{ marginLeft: 10, color: "#1e3a5a" }}>
              ({((pagina - 1) * FILAS_POR_PAGINA + 1).toLocaleString("es-PE")}
              –{Math.min(pagina * FILAS_POR_PAGINA, movimientos.length).toLocaleString("es-PE")}
              {" "}de {movimientos.length.toLocaleString("es-PE")})
            </span>
          </span>

          <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
            <PagBtn onClick={() => setPagina(1)}          disabled={pagina === 1}>«</PagBtn>
            <PagBtn onClick={() => setPagina(p => p - 1)} disabled={pagina === 1}>‹</PagBtn>
            {pageRange(pagina, totalPaginas).map((p, idx) =>
              p === null
                ? <span key={`g${idx}`} style={{ padding: "0 2px", color: "#1e3a5a", fontSize: 11 }}>…</span>
                : <PagBtn key={p} onClick={() => setPagina(p)} disabled={p === pagina} active={p === pagina}>{p}</PagBtn>
            )}
            <PagBtn onClick={() => setPagina(p => p + 1)} disabled={pagina === totalPaginas}>›</PagBtn>
            <PagBtn onClick={() => setPagina(totalPaginas)} disabled={pagina === totalPaginas}>»</PagBtn>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Estilos base ──────────────────────────────────────────────────────────────

const thEmpty: React.CSSProperties = {
  background: "#07101e",
  borderBottom: "1px solid rgba(56,139,221,0.08)",
  padding: 0,
};

function thGroup(accent: string, bg: string): React.CSSProperties {
  return {
    padding: "7px 10px",
    textAlign: "center",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(255,255,255,0.65)",
    background: bg,
    borderBottom: `2px solid ${accent}`,
    borderRight: "1px solid rgba(56,139,221,0.08)",
    fontFamily: "'Inter', sans-serif",
  };
}

function thSub(align: "left" | "right" | "center"): React.CSSProperties {
  return {
    padding: "8px 10px",
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#2a5a7a",
    background: "#07101e",
    textAlign: align,
    borderBottom: "1px solid rgba(56,139,221,0.12)",
    whiteSpace: "nowrap",
    fontFamily: "'Inter', sans-serif",
  };
}

function tdBase(align: "left" | "right" | "center"): React.CSSProperties {
  return {
    padding: "7px 10px",
    color: "#6a8ab0",
    textAlign: align,
    verticalAlign: "middle",
    whiteSpace: "nowrap",
  };
}

// ── Rango de páginas con gaps ─────────────────────────────────────────────────
function pageRange(current: number, total: number): (number | null)[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | null)[] = [1];
  if (current > 3)           pages.push(null);
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) pages.push(p);
  if (current < total - 2)   pages.push(null);
  pages.push(total);
  return pages;
}

// ── Badge de tipo de operación ────────────────────────────────────────────────
const OP_STYLE: Record<string, { bg: string; border: string; color: string; label: string }> = {
  venta:  { bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.25)",  color: "#f87171", label: "Venta"      },
  compra: { bg: "rgba(34,197,94,0.1)",  border: "rgba(34,197,94,0.25)",  color: "#4ade80", label: "Compra"     },
  devolu: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", color: "#fbbf24", label: "Devolución" },
};

function OpBadge({ op }: { op: string }) {
  const lower = op.toLowerCase();
  const key   = Object.keys(OP_STYLE).find(k => lower.includes(k));
  const s     = key ? OP_STYLE[key] : null;

  if (!s) return <span style={{ color: "#4a7a9a" }}>{op}</span>;

  return (
    <span style={{
      display: "inline-block",
      padding: "2px 8px",
      borderRadius: 4,
      fontSize: 10,
      fontWeight: 600,
      background: s.bg,
      border: `1px solid ${s.border}`,
      color: s.color,
      fontFamily: "'Inter', sans-serif",
      letterSpacing: "0.03em",
    }}>
      {s.label}
    </span>
  );
}

// ── Botón de paginación ───────────────────────────────────────────────────────
interface PagBtnProps {
  onClick:  () => void
  disabled: boolean
  children: React.ReactNode
  active?:  boolean
}

function PagBtn({ onClick, disabled, children, active }: PagBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        minWidth: 28,
        height: 28,
        padding: "0 7px",
        borderRadius: 6,
        fontSize: 11.5,
        fontWeight: active ? 700 : 400,
        fontFamily: "'JetBrains Mono', monospace",
        background: active
          ? "#2563eb"
          : disabled
          ? "rgba(56,139,221,0.04)"
          : "rgba(56,139,221,0.08)",
        color: active ? "white" : disabled ? "#1e3a5a" : "#3b82f6",
        border: active
          ? "1px solid #2563eb"
          : "1px solid rgba(56,139,221,0.14)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.1s, color 0.1s",
      }}
    >
      {children}
    </button>
  );
}
