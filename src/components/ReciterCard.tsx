import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchReciters } from "@/lib/quran-api";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSettings } from "@/contexts/SettingsContext";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export function ReciterCard() {
  const player = usePlayer();
  const { lang } = useSettings();
  const [open, setOpen] = useState(false);
  const { data: reciters = [], isLoading } = useQuery({
    queryKey: ["reciters"],
    queryFn: fetchReciters,
    staleTime: 1000 * 60 * 60 * 24,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex w-full items-center gap-4 rounded-2xl bg-surface/70 p-4 text-left shadow-card transition-base hover:bg-surface active:scale-[0.99]">
          <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-gradient-gold text-gold-foreground text-2xl font-bold">
            {player.reciterName.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-medium text-gold">{lang.ui.reciter}</div>
            <div className="truncate text-lg font-semibold text-foreground">{player.reciterName}</div>
          </div>
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{lang.ui.selectReciter}</DialogTitle>
        </DialogHeader>
        <div className="-mx-6 max-h-[60vh] overflow-y-auto px-6">
          {isLoading && <div className="py-8 text-center text-muted-foreground">{lang.ui.loading}</div>}
          <div className="flex flex-col gap-1">
            {reciters.map((r) => (
              <button
                key={r.identifier}
                onClick={() => { player.setReciter(r.identifier, r.englishName); setOpen(false); }}
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
      </DialogContent>
    </Dialog>
  );
}
