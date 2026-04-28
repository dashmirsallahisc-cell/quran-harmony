import { createFileRoute, Link } from "@tanstack/react-router";
import { useSettings, LANGUAGES } from "@/contexts/SettingsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun, Leaf } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/settings")({ component: SettingsPage });

function SettingsPage() {
  const s = useSettings();
  const p = usePlayer();
  const themes = [
    { id: "dark"  as const, label: s.lang.ui.dark,  icon: Moon },
    { id: "light" as const, label: s.lang.ui.light, icon: Sun },
    { id: "green" as const, label: s.lang.ui.green, icon: Leaf },
  ];

  return (
    <div className="flex flex-col gap-5 px-4 pt-6 pb-4">
      <Link to="/" className="text-sm text-gold">← {s.lang.ui.home}</Link>
      <h1 className="text-2xl font-bold text-foreground">{s.lang.ui.settings}</h1>

      <section className="rounded-2xl bg-surface/60 p-4 shadow-card">
        <div className="mb-3 text-sm font-semibold text-muted-foreground">{s.lang.ui.theme}</div>
        <div className="grid grid-cols-3 gap-2">
          {themes.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => s.setTheme(id)}
              className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition-base ${
                s.theme === id ? "border-gold bg-gold/10" : "border-border/40 hover:border-gold/40"
              }`}>
              <Icon className={`h-5 w-5 ${s.theme === id ? "text-gold" : "text-muted-foreground"}`} />
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-surface/60 p-4 shadow-card">
        <label className="mb-2 block text-sm font-semibold text-muted-foreground">{s.lang.ui.selectLanguage}</label>
        <Select value={s.language} onValueChange={s.setLanguage}>
          <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
          <SelectContent className="max-h-[60vh]">
            {LANGUAGES.map((l) => (
              <SelectItem key={l.code} value={l.code}>{l.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <section className="rounded-2xl bg-surface/60 p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium text-foreground">{s.lang.ui.showTranslation}</div>
            <div className="text-xs text-muted-foreground">{s.lang.name}</div>
          </div>
          <Switch checked={s.showTranslation} onCheckedChange={s.setShowTranslation} />
        </div>
      </section>

      <section className="rounded-2xl bg-surface/60 p-4 shadow-card">
        <div className="flex items-center justify-between">
          <div className="font-medium text-foreground">{s.lang.ui.autoplay}</div>
          <Switch checked={p.autoplay} onCheckedChange={p.setAutoplay} />
        </div>
        <div className="mt-4">
          <div className="mb-2 text-sm font-medium text-foreground">{s.lang.ui.playbackSpeed}</div>
          <div className="flex gap-2">
            {[0.75, 1, 1.25, 1.5, 2].map((sp) => (
              <button key={sp} onClick={() => p.setSpeed(sp)}
                className={`flex-1 rounded-lg border py-2 text-sm transition-base ${
                  p.speed === sp ? "border-gold bg-gold text-gold-foreground" : "border-border/40 text-muted-foreground hover:border-gold/40"
                }`}>{sp}x</button>
            ))}
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-muted-foreground">{s.lang.ui.createdBy}</p>
    </div>
  );
}
