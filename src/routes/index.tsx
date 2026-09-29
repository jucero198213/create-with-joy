import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { BottomDownloadBar } from "@/components/builder/BottomDownloadBar";
import { ConfigSidebar } from "@/components/builder/ConfigSidebar";
import { Dropdown } from "@/components/builder/Dropdown";
import { ReportPreview } from "@/components/builder/ReportPreview";
import { SegmentedControl } from "@/components/builder/SegmentedControl";
import { DEFAULT_STATE, type BuilderState, type PreviewMode } from "@/components/builder/types";

const TITLE = "Dashboard Builder Kit — temas e fundos para Power BI";
const DESC =
  "Monte o layout do seu relatório Power BI, veja o mockup em tempo real e baixe o tema, os fundos e as posições.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PowerBIKitBuilder,
});

function PowerBIKitBuilder() {
  const [state, setState] = useState<BuilderState>(DEFAULT_STATE);
  const update = (patch: Partial<BuilderState>) => setState((s) => ({ ...s, ...patch }));

  // Keep activePage valid when pages are removed.
  const activePage = state.pages.some((p) => p.id === state.activePage)
    ? state.activePage
    : state.pages[0]?.id ?? 0;
  const view = { ...state, activePage };

  return (
    <div className="min-h-screen bg-background lg:grid lg:h-screen lg:grid-cols-[34fr_66fr] lg:overflow-hidden">
      <ConfigSidebar state={view} update={update} />

      <section className="flex min-w-0 flex-col gap-4 p-4 sm:p-6 lg:h-screen lg:overflow-y-auto">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="w-full max-w-[280px]">
            <SegmentedControl<PreviewMode>
              size="sm"
              label="Modo do preview"
              value={view.previewMode}
              onChange={(previewMode) => update({ previewMode })}
              options={[
                { value: "data", label: "Com dados" },
                { value: "background", label: "Só o fundo" },
              ]}
            />
          </div>
          <Dropdown
            label="Página do preview"
            className="w-full sm:w-52"
            value={String(activePage)}
            onChange={(v) => update({ activePage: Number(v) })}
            options={view.pages.map((p) => ({ value: String(p.id), label: p.name || "Sem nome" }))}
          />
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <ReportPreview state={view} />
        </div>

        <BottomDownloadBar state={view} />
      </section>
    </div>
  );
}
