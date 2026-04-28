import { createFileRoute, Link } from "@tanstack/react-router";
import { Settings as Cog, Info, Heart, Download, Clock } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export const Route = createFileRoute("/more")({ component: MorePage });

function MorePage() {
  const { lang } = useSettings();
  const items = [
    { to: "/favorites" as const, label: lang.ui.favorites, icon: Heart },
    { to: "/downloads" as const, label: lang.ui.downloads, icon: Download },
    { to: "/history" as const,   label: lang.ui.history,   icon: Clock },
    { to: "/settings" as const,  label: lang.ui.settings,  icon: Cog },
    { to: "/about" as const,     label: lang.ui.about,     icon: Info },
  ];
  return (
    <div className="flex flex-col gap-3 px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-foreground">{lang.ui.more}</h1>
      <div className="flex flex-col gap-2">
        {items.map(({ to, label, icon: Icon }) => (
          <Link key={to} to={to} className="flex items-center gap-3 rounded-2xl bg-surface/60 p-4 shadow-card transition-base hover:bg-surface">
            <Icon className="h-5 w-5 text-gold" />
            <span className="font-medium text-foreground">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
