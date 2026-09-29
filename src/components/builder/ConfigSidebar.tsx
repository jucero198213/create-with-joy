import { ImageUp, LayoutPanelTop, Palette } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Dropdown } from "./Dropdown";
import { PageListEditor } from "./PageListEditor";
import { SegmentedControl } from "./SegmentedControl";
import {
  VISUAL_LAYOUTS,
  isHex,
  type BuilderState,
  type CardRadius,
  type GraphicFrame,
  type MenuType,
  type ReportBackground,
  type VisualLayout,
} from "./types";

interface Props {
  state: BuilderState;
  update: (patch: Partial<BuilderState>) => void;
}

function Card({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-[20px] border border-border bg-card p-5 shadow-soft">
      <h2 className="heading mb-4 flex items-center gap-2 text-[22px] font-bold leading-none text-foreground">
        {icon}
        {title}
      </h2>
      <div className="flex flex-col gap-5">{children}</div>
    </section>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-[13px] font-medium text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

function BrandSettings({ state, update }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [hexDraft, setHexDraft] = useState(state.primaryColor);

  useEffect(() => setHexDraft(state.primaryColor), [state.primaryColor]);

  const onFile = (file: File | undefined) => {
    if (!file) return;
    if (state.logo) URL.revokeObjectURL(state.logo);
    update({ logo: URL.createObjectURL(file) });
  };

  const onHex = (value: string) => {
    const v = value.startsWith("#") ? value : `#${value}`;
    setHexDraft(v.slice(0, 7));
    if (isHex(v)) update({ primaryColor: v.toUpperCase() });
  };

  return (
    <Card title="Marca">
      <Field label="Nome do relatório" htmlFor="report-name">
        <input
          id="report-name"
          value={state.reportName}
          onChange={(e) => update({ reportName: e.target.value })}
          className="h-11 rounded-2xl border border-field-border bg-field px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40"
        />
      </Field>

      <Field label="Logo da empresa">
        <input
          ref={fileRef}
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          className="sr-only"
          onChange={(e) => {
            onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="heading flex h-11 items-center justify-center gap-2 rounded-2xl border border-dashed border-field-border bg-field text-[15px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary"
        >
          <ImageUp className="size-[18px]" />
          {state.logo ? "Trocar a logo" : "Subir a logo"}
        </button>
      </Field>

      <Field label="Cor principal" htmlFor="primary-hex">
        <div className="flex items-center gap-2.5">
          <label className="relative size-11 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-field-border">
            <span className="absolute inset-0" style={{ backgroundColor: state.primaryColor }} />
            <input
              type="color"
              aria-label="Escolher cor principal"
              value={state.primaryColor.toLowerCase()}
              onChange={(e) => update({ primaryColor: e.target.value.toUpperCase() })}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
          </label>
          <input
            id="primary-hex"
            value={hexDraft}
            onChange={(e) => onHex(e.target.value)}
            spellCheck={false}
            maxLength={7}
            className="h-11 min-w-0 flex-1 rounded-2xl border border-field-border bg-field px-4 font-mono text-sm uppercase text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </div>
      </Field>
    </Card>
  );
}

function LayoutSettings({ state, update }: Props) {
  return (
    <Card title="Layout" icon={<LayoutPanelTop className="size-5 text-primary" />}>
      <Field label="Menu de páginas">
        <SegmentedControl<MenuType>
          label="Menu de páginas"
          value={state.menuType}
          onChange={(menuType) => update({ menuType })}
          options={[
            { value: "lateral", label: "Lateral" },
            { value: "icons", label: "Ícones" },
            { value: "top", label: "Topo" },
            { value: "none", label: "Sem" },
          ]}
        />
      </Field>

      <Field label="Cards no topo">
        <SegmentedControl<number>
          label="Cards no topo"
          value={state.topCards}
          onChange={(topCards) => update({ topCards })}
          options={[0, 1, 2, 3, 4, 5, 6].map((n) => ({ value: n, label: String(n) }))}
        />
      </Field>

      <Field label="Visuais">
        <Dropdown
          label="Visuais"
          value={state.visualLayout}
          onChange={(v) => update({ visualLayout: v as VisualLayout })}
          options={VISUAL_LAYOUTS.map((l) => ({ value: l.value, label: l.label }))}
        />
      </Field>

      <Field label="Páginas">
        <PageListEditor pages={state.pages} onChange={(pages) => update({ pages })} />
      </Field>
    </Card>
  );
}

function AppearanceSettings({ state, update }: Props) {
  return (
    <Card title="Aparência">
      <Field label="Fundo do relatório">
        <SegmentedControl<ReportBackground>
          label="Fundo do relatório"
          value={state.reportBackground}
          onChange={(reportBackground) => update({ reportBackground })}
          options={[
            { value: "light", label: "Claro" },
            { value: "dark", label: "Escuro" },
          ]}
        />
      </Field>

      <Field label="Cards">
        <SegmentedControl<"frame" | "plain">
          label="Cards"
          value={state.cardsFrame ? "frame" : "plain"}
          onChange={(v) => update({ cardsFrame: v === "frame" })}
          options={[
            { value: "frame", label: "Com moldura" },
            { value: "plain", label: "Sem moldura" },
          ]}
        />
      </Field>

      <Field label="Cantos dos cards">
        <SegmentedControl<CardRadius>
          label="Cantos dos cards"
          value={state.cardRadius}
          onChange={(cardRadius) => update({ cardRadius })}
          options={[
            { value: "square", label: "Reto" },
            { value: "soft", label: "Suave" },
            { value: "medium", label: "Médio" },
            { value: "round", label: "Redondo" },
          ]}
        />
      </Field>

      <Field label="Moldura dos gráficos">
        <SegmentedControl<GraphicFrame>
          label="Moldura dos gráficos"
          value={state.graphicFrame}
          onChange={(graphicFrame) => update({ graphicFrame })}
          options={[
            { value: "background", label: "No fundo" },
            { value: "theme", label: "No tema" },
          ]}
        />
        <p className="text-xs leading-relaxed text-muted-foreground">
          A moldura vem desenhada no PNG e o visual encaixa em cima dela, no pixel do posicoes.csv.
        </p>
      </Field>
    </Card>
  );
}

export function ConfigSidebar({ state, update }: Props) {
  return (
    <aside className="flex flex-col gap-4 bg-panel p-5 lg:h-screen lg:overflow-y-auto lg:p-6">
      <header className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-soft">
            <Palette className="size-5" />
          </span>
          <h1 className="heading text-[28px] font-bold leading-none text-foreground">
            Dashboard Builder Kit
          </h1>
        </div>
        <p className="text-[13px] leading-relaxed text-muted-foreground">
          Suba a logo, monte o layout e baixe o tema, o fundo de cada página e o mockup do
          relatório, com o contraste conferido. A logo não sai do seu navegador.
        </p>
      </header>
      <BrandSettings state={state} update={update} />
      <LayoutSettings state={state} update={update} />
      <AppearanceSettings state={state} update={update} />
    </aside>
  );
}
