import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { Surah } from "@/lib/quran-api";
import { fullSurahAudioUrl } from "@/lib/quran-api";
import { storageGet, storageSet } from "@/lib/storage";
import { isDownloaded } from "@/lib/downloads";
import { Capacitor } from "@capacitor/core";

const IS_NATIVE = typeof window !== "undefined" && Capacitor.isNativePlatform();
const HAS_MEDIA_SESSION =
  !IS_NATIVE && typeof navigator !== "undefined" && "mediaSession" in navigator;

interface HistoryEntry {
  surahNumber: number;
  reciterId: string;
  ts: number;
}

interface PlayerState {
  surah: Surah | null;
  reciterId: string;
  reciterName: string;
  isPlaying: boolean;
  loading: boolean;
  autoplay: boolean;
  speed: number;
}

interface PlayerProgress {
  currentTime: number;
  duration: number;
}

interface PlayerCtx extends PlayerState {
  surahs: Surah[];
  setSurahs: (s: Surah[]) => void;
  setReciter: (id: string, name: string) => void;
  setAutoplay: (v: boolean) => void;
  setSpeed: (v: number) => void;
  play: (surah: Surah) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seek: (sec: number) => void;
  history: HistoryEntry[];
  favorites: number[];
  toggleFavorite: (n: number) => void;
}

const Ctx = createContext<PlayerCtx | null>(null);
const ProgressCtx = createContext<PlayerProgress | null>(null);

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [reciterId, setReciterId] = useState("mp3quran:afs");
  const [reciterName, setReciterName] = useState("Mishary Alafasy");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const lastTimeUpdateRef = useRef(0);
  const playTokenRef = useRef(0);

  // Hydrate persisted state
  useEffect(() => {
    (async () => {
      const r = await storageGet<{ id: string; name: string } | null>("quranpro:reciter", null);
      if (r?.id === "ar.alafasy") {
        setReciterId("mp3quran:afs");
        setReciterName("Mishary Alafasy");
        storageSet("quranpro:reciter", { id: "mp3quran:afs", name: "Mishary Alafasy" });
      } else if (r) {
        setReciterId(r.id);
        setReciterName(r.name);
      }
      setAutoplay(await storageGet("quranpro:autoplay", true));
      setSpeed(await storageGet("quranpro:speed", 1));
      setHistory(await storageGet("quranpro:history", []));
      setFavorites(await storageGet("quranpro:favorites", []));
    })();
  }, []);

  // Init audio element once
  useEffect(() => {
    if (typeof window === "undefined") return;
    const a = new Audio();
    a.preload = "auto";
    audioRef.current = a;
    const onTime = () => {
      const next = Math.floor(a.currentTime);
      if (next !== lastTimeUpdateRef.current) {
        lastTimeUpdateRef.current = next;
        setCurrentTime(a.currentTime);
      }
    };
    const onMeta = () => setDuration(a.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnd = () => {
      setIsPlaying(false);
      // autoplay next
      handleEnded();
    };
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnd);
    return () => {
      a.pause();
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Use ref for stable handlers
  const stateRef = useRef({ surah, surahs, reciterId, reciterName, autoplay, speed, history });
  useEffect(() => {
    stateRef.current = { surah, surahs, reciterId, reciterName, autoplay, speed, history };
  });

  const handleEnded = () => {
    const { autoplay: ap } = stateRef.current;
    if (ap) doNext();
  };

  const playSurah = useCallback(
    async (s: Surah, requestedReciterId?: string, requestedReciterName?: string) => {
      const a = audioRef.current;
      if (!a) return;
      const token = ++playTokenRef.current;
      const activeReciterId = requestedReciterId ?? stateRef.current.reciterId;
      const activeReciterName = requestedReciterName ?? stateRef.current.reciterName;
      setSurah(s);
      setLoading(true);
      const src = fullSurahAudioUrl(activeReciterId, s.number, 128);
      a.pause();
      a.currentTime = 0;
      a.src = src;
      a.playbackRate = stateRef.current.speed;
      // Pasi metadata te ngarkohet, ridergo me duration ne lock screen
      const onMetaOnce = () => {
        updateMediaSession(s);
        a.removeEventListener("loadedmetadata", onMetaOnce);
      };
      a.addEventListener("loadedmetadata", onMetaOnce);
      try {
        const dl = await isDownloaded(s.number, activeReciterId).catch(() => null);
        if (token !== playTokenRef.current) return;
        if (dl?.localUri) {
          a.src = dl.localUri;
          a.playbackRate = stateRef.current.speed;
        }
        await a.play();
      } catch (e) {
        console.warn("play failed", e);
      } finally {
        if (token === playTokenRef.current) setLoading(false);
      }
      const entry: HistoryEntry = { surahNumber: s.number, reciterId: activeReciterId, ts: Date.now() };
      const next = [
        entry,
        ...stateRef.current.history.filter(
          (h) => !(h.surahNumber === s.number && h.reciterId === activeReciterId),
        ),
      ].slice(0, 50);
      setHistory(next);
      storageSet("quranpro:history", next);
      updateMediaSession(s, activeReciterName);
    },
    [],
  ); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback(() => {
    const a = audioRef.current;
    if (!a || !surah) return;
    if (a.paused) a.play();
    else a.pause();
  }, [surah]);

  const doNext = () => {
    const { surah: s, surahs: list } = stateRef.current;
    if (!s) return;
    const idx = list.findIndex((x) => x.number === s.number);
    const n = list[idx + 1] ?? list[0];
    if (n) playSurah(n);
  };
  const doPrev = () => {
    const { surah: s, surahs: list } = stateRef.current;
    if (!s) return;
    const idx = list.findIndex((x) => x.number === s.number);
    const p = list[idx - 1] ?? list[list.length - 1];
    if (p) playSurah(p);
  };

  const next = useCallback(doNext, []); // eslint-disable-line
  const prev = useCallback(doPrev, []); // eslint-disable-line

  const seek = useCallback((sec: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = sec;
  }, []);

  const setReciter = (id: string, name: string) => {
    setReciterId(id);
    setReciterName(name);
    storageSet("quranpro:reciter", { id, name });
    // Nese ka nje surah qe po luan, riluaje me recituesin e ri
    const a = audioRef.current;
    const cur = stateRef.current.surah;
    if (a && cur) {
      const wasPlaying = !a.paused;
      const newSrc = fullSurahAudioUrl(id, cur.number, 128);
      a.src = newSrc;
      a.playbackRate = speed;
      if (wasPlaying) a.play().catch((e) => console.warn("reciter switch play failed", e));
    }
  };
  const setAutoplayP = (v: boolean) => {
    setAutoplay(v);
    storageSet("quranpro:autoplay", v);
  };
  const setSpeedP = (v: number) => {
    setSpeed(v);
    storageSet("quranpro:speed", v);
    if (audioRef.current) audioRef.current.playbackRate = v;
  };
  const toggleFavorite = (n: number) => {
    const next = favorites.includes(n) ? favorites.filter((x) => x !== n) : [...favorites, n];
    setFavorites(next);
    storageSet("quranpro:favorites", next);
  };

  // ---- MediaSession (lock-screen controls + background metadata) ----
  const updateMediaSession = (s: Surah) => {
    const dur =
      audioRef.current?.duration && isFinite(audioRef.current.duration)
        ? audioRef.current.duration
        : undefined;
    const meta = {
      title: `${s.englishName} — ${s.name}`,
      artist: reciterName,
      album: "Quran Pro",
      artwork: "/icon-512.png",
      duration: dur,
    };
    if (HAS_MEDIA_SESSION) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: meta.title,
        artist: meta.artist,
        album: meta.album,
        artwork: [
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
        ],
      });
    }
  };

  useEffect(() => {
    const seekRel = (offset: number) => {
      const a = audioRef.current;
      if (!a) return;
      const next = Math.max(0, Math.min(a.duration || 0, a.currentTime + offset));
      a.currentTime = next;
    };
    if (!HAS_MEDIA_SESSION) return;
    const setMediaAction = (action: MediaSessionAction, handler: MediaSessionActionHandler) => {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        return;
      }
    };
    setMediaAction("play", () => audioRef.current?.play());
    setMediaAction("pause", () => audioRef.current?.pause());
    setMediaAction("previoustrack", () => doPrev());
    setMediaAction("nexttrack", () => doNext());
    setMediaAction("seekforward", (e) => seekRel(e.seekOffset ?? 10));
    setMediaAction("seekbackward", (e) => seekRel(-(e.seekOffset ?? 10)));
    setMediaAction("seekto", (e) => {
      if (!audioRef.current || e.seekTime == null) return;
      if (e.fastSeek && "fastSeek" in audioRef.current) {
        (audioRef.current as HTMLAudioElement & { fastSeek: (time: number) => void }).fastSeek(
          e.seekTime,
        );
      } else {
        audioRef.current.currentTime = e.seekTime;
      }
    });
    return () => {
      [
        "play",
        "pause",
        "previoustrack",
        "nexttrack",
        "seekto",
        "seekforward",
        "seekbackward",
      ].forEach((k) => {
        try {
          navigator.mediaSession.setActionHandler(k as MediaSessionAction, null);
        } catch {
          return;
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update playback position state — sinkronizon scrubber-in në lock screen kur sistemi e mbështet.
  useEffect(() => {
    if (!duration || !isFinite(duration)) return;
    if (HAS_MEDIA_SESSION) {
      try {
        navigator.mediaSession.setPositionState({
          duration,
          position: Math.min(currentTime, duration),
          playbackRate: speed,
        });
      } catch {
        return;
      }
    }
  }, [currentTime, duration, speed]);

  useEffect(() => {
    if (!HAS_MEDIA_SESSION) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  const value = useMemo<PlayerCtx>(
    () => ({
      surah,
      reciterId,
      reciterName,
      isPlaying,
      loading,
      autoplay,
      speed,
      surahs,
      setSurahs,
      setReciter,
      setAutoplay: setAutoplayP,
      setSpeed: setSpeedP,
      play: playSurah,
      toggle,
      next,
      prev,
      seek,
      history,
      favorites,
      toggleFavorite,
    }),
    [
      surah,
      reciterId,
      reciterName,
      isPlaying,
      loading,
      autoplay,
      speed,
      surahs,
      history,
      favorites,
      playSurah,
      toggle,
      next,
      prev,
      seek,
    ],
  );

  return (
    <Ctx.Provider value={value}>
      <ProgressCtx.Provider value={{ currentTime, duration }}>{children}</ProgressCtx.Provider>
    </Ctx.Provider>
  );
}

export function usePlayer() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePlayer must be inside PlayerProvider");
  return v;
}

export function usePlayerProgress() {
  const v = useContext(ProgressCtx);
  if (!v) throw new Error("usePlayerProgress must be inside PlayerProvider");
  return v;
}
