import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { TopBar } from "@/components/TopBar";
import { ReciterCard } from "@/components/ReciterCard";
import { QuickActions } from "@/components/QuickActions";
import { SurahCard } from "@/components/SurahCard";
import { fetchSurahs } from "@/lib/quran-api";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const { lang } = useSettings();
  const player = usePlayer();
  const [tab, setTab] = useState<"surahs" | "juz">("surahs");
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState("");
  const { data: surahs = [], isLoading, error } = useQuery({
    queryKey: ["surahs"],
    queryFn: fetchSurahs,
    staleTime: Infinity,
  });

  useEffect(() => { if (surahs.length) player.setSurahs(surahs); }, [surahs]); // eslint-disable-line

  const filtered = useMemo(() => {
    if (!q.trim()) return surahs;
    const t = q.toLowerCase();
    return surahs.filter((s) =>
      s.englishName.toLowerCase().includes(t) ||
      s.englishNameTranslation.toLowerCase().includes(t) ||
      String(s.number).includes(t),
    );
  }, [surahs, q]);

  const juzGroups = useMemo(() => Array.from({ length: 30 }, (_, i) => i + 1), []);

  return (
    <div className="flex flex-col gap-4 px-3 pb-4">
      <TopBar onSearch={() => setSearchOpen((v) => !v)} />

      {searchOpen && (
        <div className="relative px-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder={lang.ui.searchSurah}
            className="bg-surface/60 pl-9 pr-9 h-11"
          />
          {q && (
            <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      <div className="px-1"><ReciterCard /></div>
      <div className="px-1"><QuickActions /></div>

      <div className="mt-2 grid grid-cols-2 px-1 text-center">
        {(["surahs", "juz"] as const).map((t) => (
          <button
            key={t} onClick={() => setTab(t)}
            className={`relative pb-2 text-base font-semibold transition-base ${tab === t ? "text-gold" : "text-muted-foreground"}`}
          >
            {t === "surahs" ? lang.ui.surahs : lang.ui.juz}
            {tab === t && <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-gold" />}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 px-1">
        {error && (
          <div className="rounded-xl bg-destructive/10 p-4 text-center text-sm text-destructive">
            {(error as Error).message}
          </div>
        )}
        {isLoading && Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-[72px] animate-pulse rounded-2xl bg-surface/50" />
        ))}
        {tab === "surahs" && filtered.map((s) => <SurahCard key={s.number} surah={s} />)}
        {tab === "juz" && (
          <div className="grid grid-cols-2 gap-2">
            {juzGroups.map((n) => (
              <div key={n} className="rounded-2xl border border-border/40 bg-surface/60 p-4 shadow-card">
                <div className="text-xs text-muted-foreground">{lang.ui.juz}</div>
                <div className="text-2xl font-bold text-gold">{n}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
