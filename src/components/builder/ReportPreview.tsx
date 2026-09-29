import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PageIcon } from "./PageIcon";
import { VISUAL_TITLES, VisualBody } from "./PreviewVisuals";
import { RADIUS_PX, VISUAL_LAYOUTS, type BuilderState, type ReportPage } from "./types";

const BASE_W = 1280;
const BASE_H = 720;

const KPIS = [
  { label: "Receita", value: "R$ 4,2 mi", delta: "▲ 12% vs mês anterior", up: true },
  { label: "Margem", value: "31,4%", delta: "▲ 2,1 p.p.", up: true },
  { label: "Clientes ativos", value: "8.412", delta: "▼ 3% vs mês anterior", up: false },
  { label: "Ticket médio", value: "R$ 498", delta: "▲ 5% vs mês anterior", up: true },
  { label: "NPS", value: "72", delta: "▲ 4 pontos", up: true },
  { label: "Pedidos", value: "21,7 mil", delta: "▲ 8% vs mês anterior", up: true },
];

interface FrameProps {
  state: BuilderState;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

function Frame({ state, className, style, children }: FrameProps) {
  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden",
        state.cardsFrame && "border border-rp-border bg-rp-surface shadow-[0_1px_2px_oklch(0_0_0/0.05)]",
        className,
      )}
      style={{ borderRadius: RADIUS_PX[state.cardRadius], ...style }}
    >
      {children}
    </div>
  );
}

function LogoBox({ logo, className }: { logo: string | null; className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center overflow-hidden rounded-lg border border-dashed border-rp-border text-[12px] text-rp-muted",
        className,
      )}
    >
      {logo ? (
        <img src={logo} alt="Logo da empresa" className="size-full object-contain p-1.5" />
      ) : (
        "sua logo"
      )}
    </div>
  );
}

function NavItem({
  page,
  active,
  iconOnly,
  horizontal,
}: {
  page: ReportPage;
  active: boolean;
  iconOnly?: boolean;
  horizontal?: boolean;
}) {
  return (
    <div
      title={page.name}
      className={cn(
        "relative flex items-center gap-3 rounded-lg text-[14px] font-medium",
        horizontal ? "h-9 px-3" : iconOnly ? "h-10 justify-center" : "h-10 px-3",
        active ? "bg-rp-brand-soft text-rp-brand" : "text-rp-muted",
      )}
    >
      {active && !horizontal && (
        <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r bg-rp-brand" />
      )}
      {active && horizontal && (
        <span className="absolute inset-x-3 -bottom-[7px] h-[3px] rounded-t bg-rp-brand" />
      )}
      <PageIcon name={page.icon} className="size-[18px] shrink-0" />
      {!iconOnly && <span className="truncate">{page.name}</span>}
    </div>
  );
}

function PreviewContent({ state, page }: { state: BuilderState; page: ReportPage }) {
  const showData = state.previewMode === "data";
  const layout = VISUAL_LAYOUTS.find((l) => l.value === state.visualLayout) ?? VISUAL_LAYOUTS[0];
  const kpis = KPIS.slice(0, state.topCards);

  return (
    <main className="flex min-h-0 min-w-0 flex-1 flex-col gap-4 p-7">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-[24px] font-extrabold leading-tight text-rp-text">
            {showData ? page.name : "\u00A0"}
          </h3>
          <p className="text-[13px] text-rp-muted">{showData ? "Setembro de 2026 · dados ilustrativos" : "\u00A0"}</p>
        </div>
        {state.menuType === "none" && <LogoBox logo={state.logo} className="h-12 w-28 shrink-0" />}
      </div>

      {kpis.length > 0 && (
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${kpis.length}, minmax(0, 1fr))` }}>
          {kpis.map((k) => (
            <Frame key={k.label} state={state} className="h-[98px] px-4 py-3.5">
              {showData && (
                <>
                  <div className="text-[12px] font-medium text-rp-muted">{k.label}</div>
                  <div className="mt-1 text-[28px] font-extrabold leading-none text-rp-brand">{k.value}</div>
                  <div className={cn("mt-2 text-[11px] font-semibold", k.up ? "text-rp-pos" : "text-rp-neg")}>
                    {k.delta}
                  </div>
                </>
              )}
            </Frame>
          ))}
        </div>
      )}

      <div
        className="grid min-h-0 flex-1 gap-4"
        style={{ gridTemplateColumns: layout.cols, gridTemplateRows: layout.rows }}
      >
        {layout.slots.map((slot, i) => (
          <Frame
            key={`${layout.value}-${i}`}
            state={state}
            className="flex min-h-0 flex-col p-4"
            style={{ gridColumn: slot.col, gridRow: slot.row }}
          >
            {showData && (
              <>
                <div className="mb-2.5 truncate text-[13px] font-bold text-rp-text">{VISUAL_TITLES[slot.kind]}</div>
                <div className="min-h-0 flex-1">
                  <VisualBody kind={slot.kind} compact={slot.compact} />
                </div>
              </>
            )}
          </Frame>
        ))}
      </div>
    </main>
  );
}

export function ReportPreview({ state }: { state: BuilderState }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / BASE_W));
    ro.observe(el);
    setScale(el.clientWidth / BASE_W);
    return () => ro.disconnect();
  }, []);

  const page = state.pages.find((p) => p.id === state.activePage) ?? state.pages[0];
  const dark = state.reportBackground === "dark";
  const { menuType } = state;

  const sidebarNav = (iconOnly: boolean) => (
    <nav
      className={cn(
        "flex shrink-0 flex-col border-r border-rp-border bg-rp-surface",
        iconOnly ? "w-[68px] px-2.5 py-4" : "w-[180px] px-3 py-4",
      )}
    >
      <LogoBox logo={state.logo} className={iconOnly ? "mb-4 h-11 w-full" : "mb-5 h-16 w-full"} />
      <div className="flex flex-col gap-1">
        {state.pages.map((p) => (
          <NavItem key={p.id} page={p} active={p.id === page.id} iconOnly={iconOnly} />
        ))}
      </div>
    </nav>
  );

  return (
    <div
      ref={wrapRef}
      className="relative w-full overflow-hidden rounded-xl border border-border shadow-soft"
      style={{ aspectRatio: "16 / 9" }}
    >
      <div
        className={cn("rp absolute left-0 top-0 flex origin-top-left bg-rp-bg text-rp-text", dark ? "rp-dark" : "rp-light")}
        style={
          {
            width: BASE_W,
            height: BASE_H,
            transform: `scale(${scale})`,
            "--rp-brand": state.primaryColor,
            flexDirection: menuType === "top" ? "column" : "row",
          } as CSSProperties
        }
      >
        {menuType === "lateral" && sidebarNav(false)}
        {menuType === "icons" && sidebarNav(true)}
        {menuType === "top" && (
          <nav className="flex h-[58px] shrink-0 items-center gap-4 border-b border-rp-border bg-rp-surface px-6">
            <LogoBox logo={state.logo} className="h-9 w-24 shrink-0" />
            <div className="ml-2 flex items-center gap-1">
              {state.pages.map((p) => (
                <NavItem key={p.id} page={p} active={p.id === page.id} horizontal />
              ))}
            </div>
          </nav>
        )}
        <PreviewContent state={state} page={page} />
      </div>
    </div>
  );
}
