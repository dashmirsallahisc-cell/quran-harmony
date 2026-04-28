import { Menu, Search, MoonStar } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useSettings } from "@/contexts/SettingsContext";

export function TopBar({ onMenu, onSearch }: { onMenu?: () => void; onSearch?: () => void }) {
  const { lang } = useSettings();
  return (
    <header className="flex items-center justify-between px-4 pt-4 pb-3">
      <button aria-label="Menu" onClick={onMenu} className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-muted/40 transition-base">
        <Menu className="h-6 w-6" />
      </button>
      <Link to="/" className="flex items-center gap-2">
        <span className="text-xl font-bold text-gold tracking-wide">{lang.ui.appTitle}</span>
        <MoonStar className="h-5 w-5 text-gold" />
      </Link>
      <button aria-label="Search" onClick={onSearch} className="grid h-10 w-10 place-items-center rounded-full text-foreground hover:bg-muted/40 transition-base">
        <Search className="h-6 w-6" />
      </button>
    </header>
  );
}
