import { Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { usePlayer, usePlayerProgress } from "@/contexts/PlayerContext";

const fmt = (s: number) => {
  if (!isFinite(s)) return "00:00";
  const m = Math.floor(s / 60), x = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(x).padStart(2, "0")}`;
};

export function MiniPlayer() {
  const p = usePlayer();
  const progress = usePlayerProgress();
  if (!p.surah) return null;
  const pct = progress.duration ? (progress.currentTime / progress.duration) * 100 : 0;
  return (
    <div className="border-t border-border/40 bg-surface/95 px-3 pt-3 pb-2 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <Link to="/player" className="flex min-w-0 flex-1 items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-gold text-gold-foreground font-bold">
            {p.surah.number}
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-foreground">{p.surah.englishName}</div>
            <div className="truncate text-xs text-gold">{p.reciterName}</div>
          </div>
        </Link>
        <button onClick={p.prev} aria-label="Previous" className="grid h-9 w-9 place-items-center rounded-full text-foreground transition-base hover:bg-muted/50 active:scale-90">
          <SkipBack className="h-5 w-5 fill-current" />
        </button>
        <button onClick={p.toggle} aria-label="Play/Pause" className="grid h-12 w-12 place-items-center rounded-full bg-gradient-gold text-gold-foreground shadow-glow transition-base active:scale-90">
          {p.isPlaying ? <Pause className="h-5 w-5 fill-current" /> : <Play className="h-5 w-5 fill-current ml-0.5" />}
        </button>
        <button onClick={p.next} aria-label="Next" className="grid h-9 w-9 place-items-center rounded-full text-foreground transition-base hover:bg-muted/50 active:scale-90">
          <SkipForward className="h-5 w-5 fill-current" />
        </button>
      </div>
      <div className="mt-2 flex items-center gap-2 text-[10px] tabular-nums text-muted-foreground">
        <span>{fmt(progress.currentTime)}</span>
        <div className="relative flex-1">
          <input
            type="range" min={0} max={progress.duration || 0} step={1} value={progress.currentTime}
            onChange={(e) => p.seek(Number(e.target.value))}
            className="h-1 w-full cursor-pointer appearance-none rounded-full bg-muted accent-[var(--color-gold)]"
            style={{ background: `linear-gradient(to right, var(--color-gold) ${pct}%, var(--color-muted) ${pct}%)` }}
          />
        </div>
        <span>{fmt(progress.duration)}</span>
      </div>
    </div>
  );
}
