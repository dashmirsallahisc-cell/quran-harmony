import { Link, useLocation } from "@tanstack/react-router";
import { Home, Music, Bookmark, MoreHorizontal } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export function BottomNav() {
  const loc = useLocation();
  const { lang } = useSettings();
  const items = [
    { to: "/" as const,         icon: Home,            label: lang.ui.home },
    { to: "/player" as const,   icon: Music,           label: lang.ui.player },
    { to: "/favorites" as const,icon: Bookmark,        label: lang.ui.bookmarks },
    { to: "/more" as const,     icon: MoreHorizontal,  label: lang.ui.more },
  ];
  return (
    <nav className="grid grid-cols-4 border-t border-border/40 bg-surface/95 backdrop-blur-md">
      {items.map(({ to, icon: Icon, label }) => {
        const active = loc.pathname === to;
        return (
          <Link key={to} to={to} className="flex flex-col items-center gap-1 py-2.5 transition-base">
            <Icon className={`h-5 w-5 ${active ? "text-gold" : "text-muted-foreground"}`} />
            <span className={`text-[11px] ${active ? "font-semibold text-gold" : "text-muted-foreground"}`}>{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
