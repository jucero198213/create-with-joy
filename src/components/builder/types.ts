export type MenuType = "lateral" | "icons" | "top" | "none";
export type VisualLayout =
  | "2x2"
  | "2side"
  | "3side"
  | "main-support"
  | "wide-2"
  | "main-support-3"
  | "tall-2";
export type ReportBackground = "light" | "dark";
export type CardRadius = "square" | "soft" | "medium" | "round";
export type GraphicFrame = "background" | "theme";
export type PreviewMode = "data" | "background";
export type PageIcon = "dashboard" | "cart" | "users" | "settings" | "file";
export type VisualKind = "line" | "bars" | "table" | "stacked" | "columns";

export interface ReportPage {
  id: number;
  name: string;
  icon: PageIcon;
}

export interface BuilderState {
  reportName: string;
  logo: string | null;
  primaryColor: string;
  menuType: MenuType;
  topCards: number;
  visualLayout: VisualLayout;
  pages: ReportPage[];
  activePage: number;
  reportBackground: ReportBackground;
  cardsFrame: boolean;
  cardRadius: CardRadius;
  graphicFrame: GraphicFrame;
  previewMode: PreviewMode;
}

export const DEFAULT_STATE: BuilderState = {
  reportName: "Meu Relatório",
  logo: null,
  primaryColor: "#4E7CFF",
  menuType: "lateral",
  topCards: 4,
  visualLayout: "2x2",
  pages: [
    { id: 1, name: "Visão geral", icon: "dashboard" },
    { id: 2, name: "Vendas", icon: "cart" },
    { id: 3, name: "Clientes", icon: "users" },
    { id: 4, name: "Operação", icon: "settings" },
  ],
  activePage: 1,
  reportBackground: "light",
  cardsFrame: true,
  cardRadius: "medium",
  graphicFrame: "background",
  previewMode: "data",
};

export const RADIUS_PX: Record<CardRadius, number> = {
  square: 0,
  soft: 6,
  medium: 12,
  round: 20,
};

interface Slot {
  kind: VisualKind;
  col?: string;
  row?: string;
  compact?: boolean;
}

export interface LayoutDef {
  value: VisualLayout;
  label: string;
  cols: string;
  rows: string;
  slots: Slot[];
}

export const VISUAL_LAYOUTS: LayoutDef[] = [
  {
    value: "2x2",
    label: "2 × 2",
    cols: "1fr 1fr",
    rows: "1fr 1fr",
    slots: [{ kind: "line" }, { kind: "bars" }, { kind: "table" }, { kind: "stacked" }],
  },
  {
    value: "2side",
    label: "2 lado a lado",
    cols: "1fr 1fr",
    rows: "1fr",
    slots: [{ kind: "line" }, { kind: "bars" }],
  },
  {
    value: "3side",
    label: "3 lado a lado",
    cols: "repeat(3, 1fr)",
    rows: "1fr",
    slots: [
      { kind: "line", compact: true },
      { kind: "bars", compact: true },
      { kind: "columns", compact: true },
    ],
  },
  {
    value: "main-support",
    label: "Principal + apoio",
    cols: "2fr 1fr",
    rows: "1fr",
    slots: [{ kind: "line" }, { kind: "bars" }],
  },
  {
    value: "wide-2",
    label: "1 largo + 2",
    cols: "1fr 1fr",
    rows: "1.1fr 1fr",
    slots: [{ kind: "line", col: "1 / -1" }, { kind: "bars" }, { kind: "table" }],
  },
  {
    value: "main-support-3",
    label: "Principal + apoio + 3",
    cols: "repeat(6, 1fr)",
    rows: "1.25fr 1fr",
    slots: [
      { kind: "line", col: "span 4" },
      { kind: "bars", col: "span 2" },
      { kind: "table", col: "span 2", compact: true },
      { kind: "stacked", col: "span 2", compact: true },
      { kind: "columns", col: "span 2", compact: true },
    ],
  },
  {
    value: "tall-2",
    label: "Principal alto + 2",
    cols: "1.3fr 1fr",
    rows: "1fr 1fr",
    slots: [{ kind: "stacked", row: "span 2" }, { kind: "line" }, { kind: "bars" }],
  },
];

export const NEXT_PAGE_ICON: PageIcon = "file";

export function slugify(text: string): string {
  const slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "relatorio";
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
}

function mix(hex: string, target: string, t: number): string {
  const a = hexToRgb(hex);
  const b = hexToRgb(target);
  const out = a.map((v, i) => Math.round(v + (b[i] - v) * t));
  return "#" + out.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
}

export function isHex(value: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

export function buildTheme(state: BuilderState) {
  const dark = state.reportBackground === "dark";
  const surface = dark ? "#1B1D2A" : "#FFFFFF";
  const p = state.primaryColor.toUpperCase();
  return {
    name: state.reportName,
    dataColors: [p, mix(p, surface, 0.4), mix(p, surface, 0.62), mix(p, "#000000", 0.35), "#2FA36B", "#D9534F"],
    background: dark ? "#14151F" : "#F3F5FA",
    foreground: dark ? "#F4F5FA" : "#1E2233",
    tableAccent: p,
    good: "#2FA36B",
    bad: "#D9534F",
    visualStyles: {
      "*": {
        "*": {
          border: [{ show: state.cardsFrame, radius: RADIUS_PX[state.cardRadius] }],
        },
      },
    },
  };
}
