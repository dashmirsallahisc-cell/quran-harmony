import { createFileRoute, Link } from "@tanstack/react-router";
import { MoonStar } from "lucide-react";
import { useSettings } from "@/contexts/SettingsContext";

export const Route = createFileRoute("/about")({ component: AboutPage });

function AboutPage() {
  const { lang } = useSettings();
  return (
    <div className="flex flex-col items-center gap-5 px-6 pt-10 pb-6 text-center">
      <Link to="/" className="self-start text-sm text-gold">← {lang.ui.home}</Link>
      <div className="grid h-24 w-24 place-items-center rounded-full bg-gradient-gold shadow-glow">
        <MoonStar className="h-10 w-10 text-gold-foreground" />
      </div>
      <h1 className="text-2xl font-bold text-foreground">{lang.ui.appTitle}</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Listen to the Holy Quran with 100+ reciters, translations in 30+ languages,
        downloads for offline use and full background playback with lock-screen controls.
      </p>
      <div className="mt-6 rounded-2xl bg-surface/60 px-6 py-4 shadow-card">
        <div className="text-xs uppercase tracking-widest text-gold">Created by</div>
        <div className="mt-1 text-lg font-bold text-foreground">DS Interactive</div>
        <div className="text-sm text-muted-foreground">Dashmir Sallahi</div>
      </div>
      <p className="text-xs text-muted-foreground">
        Quran data: <a className="text-gold" href="https://alquran.cloud" target="_blank" rel="noopener">alquran.cloud</a>
      </p>
    </div>
  );
}
