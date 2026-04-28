import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Play } from "lucide-react";
import { fetchSurahs } from "@/lib/quran-api";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSettings } from "@/contexts/SettingsContext";

export const Route = createFileRoute("/history")({ component: HistoryPage });

function HistoryPage() {
  const player = usePlayer();
  const { lang } = useSettings();
  const { data: surahs = [] } = useQuery({ queryKey: ["surahs"], queryFn: fetchSurahs, staleTime: Infinity });

  return (
    <div className="flex flex-col gap-3 px-4 pt-6 pb-4">
      <Link to="/" className="text-sm text-gold">← {lang.ui.home}</Link>
      <h1 className="text-2xl font-bold text-foreground">{lang.ui.history}</h1>
      {player.history.length === 0 ? (
        <div className="mt-12 grid place-items-center text-center">
          <Clock className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">{lang.ui.noHistory}</p>
        </div>
      ) : player.history.map((h) => {
        const s = surahs.find((x) => x.number === h.surahNumber);
        return (
          <div key={`${h.surahNumber}-${h.ts}`} className="flex items-center gap-3 rounded-2xl bg-surface/60 p-3 shadow-card">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-gold-foreground font-bold">
              {h.surahNumber}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-foreground">{s?.englishName ?? `Surah ${h.surahNumber}`}</div>
              <div className="text-xs text-muted-foreground">{new Date(h.ts).toLocaleString()}</div>
            </div>
            <button onClick={() => s && player.play(s)} className="grid h-9 w-9 place-items-center rounded-full border border-gold text-gold">
              <Play className="h-4 w-4 fill-current ml-0.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
