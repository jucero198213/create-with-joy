import { Plus, X } from "lucide-react";
import { PageIcon } from "./PageIcon";
import { NEXT_PAGE_ICON, type ReportPage } from "./types";

interface Props {
  pages: ReportPage[];
  onChange: (pages: ReportPage[]) => void;
}

export function PageListEditor({ pages, onChange }: Props) {
  const rename = (id: number, name: string) =>
    onChange(pages.map((p) => (p.id === id ? { ...p, name } : p)));

  const remove = (id: number) => {
    if (pages.length <= 1) return;
    onChange(pages.filter((p) => p.id !== id));
  };

  const add = () => {
    const id = Math.max(0, ...pages.map((p) => p.id)) + 1;
    onChange([...pages, { id, name: "Nova página", icon: NEXT_PAGE_ICON }]);
  };

  return (
    <div className="flex flex-col gap-2.5">
      {pages.map((page) => (
        <div key={page.id} className="flex items-center gap-2.5">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
            <PageIcon name={page.icon} className="size-[18px]" />
          </span>
          <input
            value={page.name}
            onChange={(e) => rename(page.id, e.target.value)}
            aria-label="Nome da página"
            className="h-11 min-w-0 flex-1 rounded-2xl border border-field-border bg-field px-4 text-sm text-foreground outline-none transition-colors focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <button
            type="button"
            onClick={() => remove(page.id)}
            disabled={pages.length <= 1}
            aria-label={`Remover ${page.name}`}
            className="flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-30"
          >
            <X className="size-4" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="heading mt-1 flex h-11 items-center justify-center gap-2 rounded-2xl border border-dashed border-field-border text-[15px] font-semibold text-muted-foreground transition-colors hover:border-primary hover:text-primary"
      >
        <Plus className="size-4" />
        Adicionar página
      </button>
    </div>
  );
}
