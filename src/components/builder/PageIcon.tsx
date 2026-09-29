import { FileText, LayoutDashboard, Settings, ShoppingCart, Users } from "lucide-react";
import type { PageIcon as PageIconName } from "./types";

const ICONS = {
  dashboard: LayoutDashboard,
  cart: ShoppingCart,
  users: Users,
  settings: Settings,
  file: FileText,
} as const;

export function PageIcon({ name, className }: { name: PageIconName; className?: string }) {
  const Icon = ICONS[name] ?? FileText;
  return <Icon className={className} aria-hidden />;
}
