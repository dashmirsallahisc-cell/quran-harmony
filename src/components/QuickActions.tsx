import { Heart, Download, Clock, Settings as Cog } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSettings } from "@/contexts/SettingsContext";

export function QuickActions() {
  const { lang } = useSettings();
  const items = [
    { icon: Heart,     label: lang.ui.favorites, to: "/favorites" as const },
    { icon: Download,  label: lang.ui.downloads, to: "/downloads" as const },
    { icon: Clock,     label: lang.ui.history,   to: "/history" as const },
    { icon: Cog,       label: lang.ui.settings,  to: "/settings" as const },
  ];
  return (
    <div className="grid grid-cols-4 gap-2 rounded-2xl bg-surface/60 p-4 shadow-card">
      {items.map(({ icon: Icon, label, to }) => (
        <Link key={label} to={to} className="flex flex-col items-center gap-2 rounded-xl py-2 transition-base hover:bg-muted/40 active:scale-95">
          <Icon className="h-7 w-7 text-gold" strokeWidth={1.6} />
          <span className="text-xs font-medium text-foreground">{label}</span>
        </Link>
      ))}
    </div>
  );
}
