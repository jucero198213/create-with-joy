import { Download, FileArchive } from "lucide-react";
import { buildTheme, slugify, type BuilderState } from "./types";

function saveJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function BottomDownloadBar({ state }: { state: BuilderState }) {
  const slug = slugify(state.reportName);

  const downloadTheme = () => saveJson(`tema-${slug}.json`, buildTheme(state));

  const downloadKit = () => {
    const { logo: _logo, ...config } = state;
    saveJson(`kit-${slug}.json`, { config, theme: buildTheme(state) });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-border bg-card px-5 py-4 shadow-soft">
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground">Tema, 4 fundos, mockup e posições</div>
        <div className="truncate font-mono text-xs text-muted-foreground">tema-{slug}.json</div>
      </div>
      <div className="flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={downloadTheme}
          className="heading flex h-11 items-center gap-2 rounded-full border border-field-border bg-transparent px-5 text-[15px] font-semibold text-foreground transition-colors hover:bg-accent"
        >
          <Download className="size-4" />
          Só o tema
        </button>
        <button
          type="button"
          onClick={downloadKit}
          className="heading flex h-11 items-center gap-2 rounded-full bg-primary px-5 text-[15px] font-semibold text-primary-foreground shadow-soft transition-[filter] hover:brightness-110"
        >
          <FileArchive className="size-4" />
          Baixar o kit
        </button>
      </div>
    </div>
  );
}
