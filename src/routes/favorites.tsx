import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { fetchSurahs } from "@/lib/quran-api";
import { SurahCard } from "@/components/SurahCard";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSettings } from "@/contexts/SettingsContext";
import { Heart } from "lucide-react";

export const Route = createFileRoute("/favorites")({ component: FavoritesPage });

function FavoritesPage() {
  const player = usePlayer();
  const { lang } = useSettings();
  const { data: surahs = [] } = useQuery({ queryKey: ["surahs"], queryFn: fetchSurahs, staleTime: Infinity });
  const favs = surahs.filter((s) => player.favorites.includes(s.number));

  return (
    <div className="flex flex-col gap-3 px-4 pt-6 pb-4">
      <Link to="/" className="text-sm text-gold">← {lang.ui.home}</Link>
      <h1 className="text-2xl font-bold text-foreground">{lang.ui.favorites}</h1>
      {favs.length === 0 ? (
        <div className="mt-12 grid place-items-center text-center">
          <Heart className="mb-3 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">{lang.ui.noBookmarks}</p>
        </div>
      ) : favs.map((s) => <SurahCard key={s.number} surah={s} />)}
    </div>
  );
}
