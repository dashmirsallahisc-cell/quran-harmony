import { ChevronDown, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchReciters } from "@/lib/quran-api";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useState } from "react";

export function ReciterCard() {
  const player = usePlayer();
  const { lang } = useSettings();
  const [open, setOpen] = useState(false);
  const { data: reciters = [], isLoading } = useQuery({
    queryKey: ["reciters", "full-surah-v2"],
    queryFn: fetchReciters,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-4 rounded-2xl bg-surface/70 p-4 text-left shadow-card transition-base hover:bg-surface active:scale-[0.99]"
      >
        <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-gold text-gold-foreground text-2xl font-bold">
          {player.reciterName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-medium text-gold">{lang.ui.reciter}</div>
          <div className="truncate text-lg font-semibold text-foreground">{player.reciterName}</div>
        </div>
        <ChevronDown className="h-5 w-5 text-muted-foreground" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end bg-background/80 px-3 pb-3 backdrop-blur-sm">
          <div className="max-h-[82vh] w-full rounded-2xl border border-border bg-background shadow-card">
            <div className="flex items-center justify-between border-b border-border/40 p-4">
              <h2 className="text-lg font-semibold text-foreground">{lang.ui.selectReciter}</h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-base hover:bg-muted/50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-[68vh] overflow-y-auto p-3">
              {isLoading && (
                <div className="py-8 text-center text-muted-foreground">{lang.ui.loading}</div>
              )}
              <div className="flex flex-col gap-1">
                {reciters.map((r) => (
                  <button
                    key={r.identifier}
                    onClick={() => {
                      player.setReciter(r.identifier, r.englishName);
                      setOpen(false);
                    }}
                    className={`flex items-center justify-between rounded-lg p-3 text-left transition-base hover:bg-muted/40 ${
                      r.identifier === player.reciterId ? "bg-muted/60" : ""
                    }`}
                  >
                    <div>
                      <div className="font-medium text-foreground">{r.englishName}</div>
                      <div className="text-xs text-muted-foreground">{r.name}</div>
                    </div>
                    {r.identifier === player.reciterId && (
                      <span className="text-xs font-semibold text-gold">●</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
