import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Play, Pause, SkipBack, SkipForward, Heart, Repeat, Gauge } from "lucide-react";
import { usePlayer, usePlayerProgress } from "@/contexts/PlayerContext";
import { useSettings } from "@/contexts/SettingsContext";
import { fetchSurahArabic, fetchSurahWithTranslation } from "@/lib/quran-api";

export const Route = createFileRoute("/player")({ component: PlayerPage });

const fmt = (s: number) => {
  if (!isFinite(s)) return "00:00";
  const m = Math.floor(s / 60), x = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")}`;
};

function PlayerPage() {
  const p = usePlayer();
  const progress = usePlayerProgress();
  const { lang, showTranslation } = useSettings();

  const { data: arabic } = useQuery({
    queryKey: ["surah", "ar", p.surah?.number],
    queryFn: () => fetchSurahArabic(p.surah!.number),
    enabled: !!p.surah,
    staleTime: Infinity,
  });
  const { data: translation } = useQuery({
    queryKey: ["surah", lang.translationId, p.surah?.number],
    queryFn: () => fetchSurahWithTranslation(p.surah!.number, lang.translationId),
    enabled: !!p.surah && showTranslation && lang.translationId !== "quran-uthmani",
    staleTime: Infinity,
  });

  if (!p.surah) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <div className="mx-auto mb-6 grid h-24 w-24 place-items-center rounded-full bg-gradient-gold text-3xl text-gold-foreground shadow-glow">۞</div>
          <h2 className="text-xl font-semibold text-foreground">{lang.ui.nowPlaying}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{lang.ui.searchSurah}</p>
        </div>
      </div>
    );
  }

  const pct = progress.duration ? (progress.currentTime / progress.duration) * 100 : 0;
  const isFav = p.favorites.includes(p.surah.number);

  return (
    <div className="flex flex-col gap-5 px-4 pt-4 pb-6">
      <div className="text-center">
        <div className="text-xs uppercase tracking-widest text-gold">{lang.ui.nowPlaying}</div>
        <div className="mt-1 text-2xl font-bold text-foreground">{p.surah.englishName}</div>
        <div className="font-arabic text-2xl text-gold">{p.surah.name}</div>
        <div className="mt-1 text-sm text-muted-foreground">{p.reciterName}</div>
      </div>

      <div className="mx-auto grid h-56 w-56 place-items-center rounded-full bg-gradient-gold shadow-glow">
        <div className="grid h-52 w-52 place-items-center rounded-full bg-background">
          <span className={`font-arabic text-7xl text-gold ${p.isPlaying ? "animate-spin-slow" : ""}`}>۞</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs tabular-nums text-muted-foreground">
        <span>{fmt(progress.currentTime)}</span>
        <input
          type="range" min={0} max={progress.duration || 0} step={1} value={progress.currentTime}
          onChange={(e) => p.seek(Number(e.target.value))}
          className="h-1.5 flex-1 appearance-none rounded-full"
          style={{ background: `linear-gradient(to right, var(--color-gold) ${pct}%, var(--color-muted) ${pct}%)` }}
        />
        <span>{fmt(progress.duration)}</span>
      </div>

      <div className="flex items-center justify-center gap-6">
        <button onClick={() => p.toggleFavorite(p.surah!.number)} className="grid h-11 w-11 place-items-center rounded-full text-foreground hover:bg-muted/40 transition-base">
          <Heart className={`h-5 w-5 ${isFav ? "fill-gold text-gold" : ""}`} />
        </button>
        <button onClick={p.prev} className="grid h-12 w-12 place-items-center rounded-full text-foreground hover:bg-muted/40 transition-base active:scale-90">
          <SkipBack className="h-7 w-7 fill-current" />
        </button>
        <button onClick={p.toggle} className="grid h-16 w-16 place-items-center rounded-full bg-gradient-gold text-gold-foreground shadow-glow active:scale-90 transition-base">
          {p.isPlaying ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current ml-1" />}
        </button>
        <button onClick={p.next} className="grid h-12 w-12 place-items-center rounded-full text-foreground hover:bg-muted/40 transition-base active:scale-90">
          <SkipForward className="h-7 w-7 fill-current" />
        </button>
        <button onClick={() => p.setAutoplay(!p.autoplay)} aria-label="Autoplay" className={`grid h-11 w-11 place-items-center rounded-full transition-base hover:bg-muted/40 ${p.autoplay ? "text-gold" : "text-muted-foreground"}`}>
          <Repeat className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
        <Gauge className="h-4 w-4" />
        {[0.75, 1, 1.25, 1.5, 2].map((s) => (
          <button key={s} onClick={() => p.setSpeed(s)}
            className={`rounded-full px-2 py-0.5 transition-base ${p.speed === s ? "bg-gold text-gold-foreground" : "hover:bg-muted/40"}`}>
            {s}x
          </button>
        ))}
      </div>

      {arabic && (
        <div className="mt-2 rounded-2xl bg-surface/60 p-4 shadow-card">
          <div className="space-y-4">
            {arabic.ayahs.slice(0, 30).map((a, i) => (
              <div key={a.number} className="border-b border-border/30 pb-3 last:border-0">
                <div className="mb-2 flex items-center gap-2">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-gold text-[11px] font-bold text-gold-foreground">{a.numberInSurah}</span>
                </div>
                <p className="font-arabic text-2xl leading-loose text-foreground" dir="rtl">{a.text}</p>
                {showTranslation && translation?.ayahs[i] && (
                  <p className="mt-2 text-sm text-muted-foreground">{translation.ayahs[i].text}</p>
                )}
              </div>
            ))}
            {arabic.ayahs.length > 30 && (
              <p className="text-center text-xs text-muted-foreground">+ {arabic.ayahs.length - 30} more verses</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
