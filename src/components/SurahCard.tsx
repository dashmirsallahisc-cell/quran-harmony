import { Play, Pause, MoreVertical, Heart, Download as DLIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Surah } from "@/lib/quran-api";
import { fullSurahAudioUrl } from "@/lib/quran-api";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSettings } from "@/contexts/SettingsContext";
import { downloadSurah, isDownloaded, removeDownload } from "@/lib/downloads";

interface Props {
  surah: Surah;
}

export function SurahCard({ surah }: Props) {
  const player = usePlayer();
  const { lang } = useSettings();
  const isCurrent = player.surah?.number === surah.number;
  const isPlaying = isCurrent && player.isPlaying;
  const isFav = player.favorites.includes(surah.number);
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState<boolean | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Lazy check downloaded state on first interaction
  const checkDownloaded = async () => {
    const r = await isDownloaded(surah.number, player.reciterId);
    setDownloaded(!!r);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadSurah(
        surah.number,
        player.reciterId,
        fullSurahAudioUrl(player.reciterId, surah.number, 128),
      );
      setDownloaded(true);
    } finally {
      setDownloading(false);
    }
  };
  const handleRemove = async () => {
    await removeDownload(surah.number, player.reciterId);
    setDownloaded(false);
  };

  return (
    <div
      className={`rounded-2xl border border-border/40 bg-surface/60 p-3 shadow-card transition-base ${isCurrent ? "border-gold/60 shadow-glow" : "hover:border-gold/30"}`}
    >
      <div className="flex items-center gap-3">
        <div className="relative grid h-12 w-12 shrink-0 place-items-center">
          <svg
            viewBox="0 0 48 48"
            className="absolute inset-0 h-12 w-12 text-gold"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M24 2 L36 8 L46 24 L36 40 L24 46 L12 40 L2 24 L12 8 Z" />
          </svg>
          <span className="relative font-semibold text-gold text-sm">{surah.number}</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold text-foreground">{surah.englishName}</span>
            {isFav && <Heart className="h-3.5 w-3.5 fill-gold text-gold" />}
          </div>
          <div className="text-xs text-muted-foreground">
            {surah.numberOfAyahs} {lang.ui.verses}
          </div>
        </div>
        <button
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={() => (isCurrent ? player.toggle() : player.play(surah))}
          className="grid h-10 w-10 place-items-center rounded-full border-2 border-gold text-gold transition-base hover:bg-gold hover:text-gold-foreground active:scale-90"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-current" />
          ) : (
            <Play className="h-4 w-4 fill-current ml-0.5" />
          )}
        </button>
        <button
          aria-label="More"
          onClick={() => {
            const next = !menuOpen;
            setMenuOpen(next);
            if (next && downloaded === null) checkDownloaded();
          }}
          className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-base hover:bg-muted/50"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>
      {menuOpen && (
        <div className="mt-3 grid grid-cols-2 gap-2 border-t border-border/30 pt-3">
          <button
            onClick={() => player.toggleFavorite(surah.number)}
            className="flex items-center justify-center gap-2 rounded-xl bg-muted/40 px-3 py-2 text-sm text-foreground"
          >
            <Heart className={`h-4 w-4 ${isFav ? "fill-gold text-gold" : ""}`} />
            {isFav ? lang.ui.remove : lang.ui.favorites}
          </button>
          <button
            onClick={downloaded ? handleRemove : handleDownload}
            disabled={downloading}
            className="flex items-center justify-center gap-2 rounded-xl bg-muted/40 px-3 py-2 text-sm text-foreground disabled:opacity-60"
          >
            {downloaded ? <Trash2 className="h-4 w-4" /> : <DLIcon className="h-4 w-4" />}
            {downloaded
              ? lang.ui.remove
              : downloading
                ? `${lang.ui.download}...`
                : lang.ui.download}
          </button>
        </div>
      )}
    </div>
  );
}
