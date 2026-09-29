import type { ReactNode } from "react";
import type { VisualKind } from "./types";

const MONTHS = ["Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function Legend({ items }: { items: { label: string; className: string }[] }) {
  return (
    <div className="mb-2 flex flex-wrap gap-x-3 gap-y-1">
      {items.map((i) => (
        <span key={i.label} className="flex items-center gap-1.5 text-[11px] text-rp-muted">
          <span className={`size-2 rounded-full ${i.className}`} />
          {i.label}
        </span>
      ))}
    </div>
  );
}

/* ---------- Line chart ---------- */
const LINE_SERIES = [
  { label: "Loja física", stroke: "stroke-rp-brand", dot: "bg-rp-brand", data: [320, 335, 318, 342, 360, 380, 410, 455] },
  { label: "E-commerce", stroke: "stroke-rp-s2", dot: "bg-rp-s2", data: [180, 210, 235, 260, 290, 330, 395, 470] },
  { label: "Marketplace", stroke: "stroke-rp-muted", dot: "bg-rp-muted", data: [90, 105, 120, 118, 140, 165, 190, 220] },
];

function LineChart() {
  const max = 500;
  const path = (data: number[]) =>
    data
      .map((v, i) => `${i === 0 ? "M" : "L"} ${(i / (data.length - 1)) * 100} ${50 - (v / max) * 46 - 2}`)
      .join(" ");
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Legend items={LINE_SERIES.map((s) => ({ label: s.label, className: s.dot }))} />
      <div className="relative min-h-0 flex-1">
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
          {[0, 1, 2, 3].map((i) => (
            <line
              key={i}
              x1="0"
              x2="100"
              y1={2 + i * 15.33}
              y2={2 + i * 15.33}
              className="stroke-rp-border"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
          {LINE_SERIES.map((s) => (
            <path
              key={s.label}
              d={path(s.data)}
              fill="none"
              className={s.stroke}
              strokeWidth="2.25"
              strokeLinejoin="round"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>
      <div className="mt-1.5 flex justify-between text-[10px] text-rp-muted">
        {MONTHS.map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- Horizontal bars ---------- */
const REGIONS = [
  { label: "Sudeste", value: 1.9 },
  { label: "Sul", value: 0.92 },
  { label: "Nordeste", value: 0.71 },
  { label: "Centro-Oeste", value: 0.44 },
  { label: "Norte", value: 0.23 },
];

function BarsChart() {
  return (
    <div className="flex h-full flex-col justify-around gap-1">
      {REGIONS.map((r) => (
        <div key={r.label} className="flex items-center gap-2 text-[11px]">
          <span className="w-[74px] shrink-0 truncate text-rp-text">{r.label}</span>
          <div className="h-2.5 flex-1 rounded-full bg-rp-brand-soft">
            <div className="h-full rounded-full bg-rp-brand" style={{ width: `${(r.value / 1.9) * 100}%` }} />
          </div>
          <span className="w-8 shrink-0 text-right font-semibold text-rp-text">
            {String(r.value).replace(".", ",")}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------- Table ---------- */
const STORES = [
  { store: "Paulista", revenue: "R$ 812 mil", pct: 108 },
  { store: "Savassi", revenue: "R$ 640 mil", pct: 97 },
  { store: "Moinhos", revenue: "R$ 588 mil", pct: 112 },
  { store: "Boa Viagem", revenue: "R$ 421 mil", pct: 84 },
  { store: "Batel", revenue: "R$ 397 mil", pct: 101 },
];

function TableChart({ compact }: { compact?: boolean | undefined }) {
  const cols = compact ? "1.2fr 0.7fr 1fr" : "1.1fr 1fr 0.7fr 1.2fr";
  return (
    <div className="flex h-full flex-col text-[11px]">
      <div
        className="grid gap-2 border-b border-rp-border pb-1.5 font-semibold text-rp-muted"
        style={{ gridTemplateColumns: cols }}
      >
        <span>Loja</span>
        {!compact && <span>Receita</span>}
        <span className="text-right">vs meta</span>
        <span>Cobertura</span>
      </div>
      <div className="flex flex-1 flex-col justify-around">
        {STORES.map((s) => (
          <div key={s.store} className="grid items-center gap-2" style={{ gridTemplateColumns: cols }}>
            <span className="truncate text-rp-text">{s.store}</span>
            {!compact && <span className="text-rp-text">{s.revenue}</span>}
            <span className={`text-right font-semibold ${s.pct >= 100 ? "text-rp-pos" : "text-rp-neg"}`}>
              {s.pct}%
            </span>
            <div className="h-1.5 rounded-full bg-rp-brand-soft">
              <div
                className="h-full rounded-full bg-rp-brand"
                style={{ width: `${(Math.min(s.pct, 120) / 120) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Stacked horizontal bars ---------- */
const CATEGORIES: { label: string; values: [number, number, number, number] }[] = [
  { label: "Bebidas", values: [22, 24, 25, 27] },
  { label: "Mercearia", values: [20, 21, 22, 22] },
  { label: "Limpeza", values: [12, 12, 13, 13] },
  { label: "Higiene", values: [10, 11, 11, 12] },
  { label: "Frios", values: [9, 9, 10, 10] },
  { label: "Padaria", values: [8, 8, 8, 9] },
  { label: "Hortifrúti", values: [7, 7, 8, 8] },
  { label: "Outros", values: [5, 5, 5, 6] },
];
const YEAR_TONES = ["bg-rp-s4", "bg-rp-s3", "bg-rp-s2", "bg-rp-brand"];
const YEARS = ["2023", "2024", "2025", "2026"];

function StackedChart() {
  const max = Math.max(...CATEGORIES.map((c) => c.values.reduce((a, b) => a + b, 0)));
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Legend items={YEARS.map((y, i) => ({ label: y, className: YEAR_TONES[i] ?? "" }))} />
      <div className="flex flex-1 flex-col justify-around gap-0.5">
        {CATEGORIES.map((c) => {
          const total = c.values.reduce((a, b) => a + b, 0);
          return (
            <div key={c.label} className="flex items-center gap-2 text-[10px]">
              <span className="w-[62px] shrink-0 truncate text-rp-text">{c.label}</span>
              <div className="flex h-2.5 overflow-hidden rounded-full" style={{ width: `${(total / max) * 100}%` }}>
                {c.values.map((v, i) => (
                  <span key={i} className={YEAR_TONES[i]} style={{ width: `${(v / total) * 100}%` }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Columns ---------- */
const TICKET = [462, 470, 481, 476, 489, 498];

function ColumnsChart() {
  const max = 520;
  return (
    <div className="flex h-full min-h-0 items-end justify-between gap-2">
      {TICKET.map((v, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          <span className="text-[10px] font-semibold text-rp-text">{v}</span>
          <div
            className={`w-full rounded-t-md ${i === TICKET.length - 1 ? "bg-rp-brand" : "bg-rp-s3"}`}
            style={{ height: `${(v / max) * 78}%` }}
          />
          <span className="text-[10px] text-rp-muted">{MONTHS[i + 2]}</span>
        </div>
      ))}
    </div>
  );
}

export const VISUAL_TITLES: Record<VisualKind, string> = {
  line: "Receita por canal (R$ mil)",
  bars: "Receita por região (R$ mi)",
  table: "Metas por loja",
  stacked: "Participação por categoria",
  columns: "Ticket médio (R$)",
};

export function VisualBody({ kind, compact }: { kind: VisualKind; compact?: boolean | undefined }): ReactNode {
  switch (kind) {
    case "line":
      return <LineChart />;
    case "bars":
      return <BarsChart />;
    case "table":
      return <TableChart compact={compact} />;
    case "stacked":
      return <StackedChart />;
    case "columns":
      return <ColumnsChart />;
  }
}

