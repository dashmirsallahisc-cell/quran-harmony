import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Download, Trash2, Play } from "lucide-react";
import { getDownloads, removeDownload, type DownloadEntry } from "@/lib/downloads";
import { useQuery } from "@tanstack/react-query";
import { fetchSurahs } from "@/lib/quran-api";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSettings } from "@/contexts/SettingsContext";

export const Route = createFileRoute("/downloads")({ component: DownloadsPage });

function DownloadsPage() {
  const [items, setItems] = useState<DownloadEntry[]>([]);
  const { data: surahs = [] } = useQuery({ queryKey: ["surahs"], queryFn: fetchSurahs, staleTime: Infinity });
  const player = usePlayer();
  const { lang } = useSettings();

  const refresh = async () => setItems(await getDownloads());
  useEffect(() => { refresh(); }, []);

  return (
    <div className="flex flex-col gap-3 px-4 pt-6 pb-4">
      <Link to="/" className="text-sm text-gold">← {lang.ui.home}</Link>
      <h1 className="text-2xl font-bold text-foreground">{lang.ui.downloads}</h1>
      {items.length === 0 ? (
        <div className="mt-12 grid place-items-center text-center">
          <Download className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">{lang.ui.noDownloads}</p>
        </div>
      ) : items.map((d) => {
        const s = surahs.find((x) => x.number === d.surahNumber);
        return (
          <div key={`${d.surahNumber}-${d.reciterId}`} className="flex items-center gap-3 rounded-2xl bg-surface/60 p-3 shadow-card">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold text-gold-foreground font-bold">
              {d.surahNumber}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium text-foreground">{s?.englishName ?? `Surah ${d.surahNumber}`}</div>
              <div className="truncate text-xs text-muted-foreground">{d.reciterId}</div>
            </div>
            <button onClick={() => s && player.play(s)} className="grid h-9 w-9 place-items-center rounded-full border border-gold text-gold">
              <Play className="h-4 w-4 fill-current ml-0.5" />
            </button>
            <button onClick={async () => { await removeDownload(d.surahNumber, d.reciterId); refresh(); }} className="grid h-9 w-9 place-items-center rounded-full text-destructive hover:bg-destructive/10">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
