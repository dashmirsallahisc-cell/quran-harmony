import {
  createContext, useCallback, useContext, useEffect, useMemo, useRef, useState,
} from "react";
import type { Surah } from "@/lib/quran-api";
import { fullSurahAudioUrl } from "@/lib/quran-api";
import { storageGet, storageSet } from "@/lib/storage";
import { isDownloaded } from "@/lib/downloads";
import { setNativeMetadata, setNativePlaybackState, setNativeHandlers } from "@/lib/native-media-session";

interface HistoryEntry { surahNumber: number; reciterId: string; ts: number; }

interface PlayerState {
  surah: Surah | null;
  reciterId: string;
  reciterName: string;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  loading: boolean;
  autoplay: boolean;
  speed: number;
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

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const nativeSyncRef = useRef({ at: 0, state: "none" as "playing" | "paused" | "none", position: -1 });
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [surah, setSurah] = useState<Surah | null>(null);
  const [reciterId, setReciterId] = useState("ar.alafasy");
  const [reciterName, setReciterName] = useState("Mishary Alafasy");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [autoplay, setAutoplay] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  // Hydrate persisted state
  useEffect(() => {
    (async () => {
      const r = await storageGet<{ id: string; name: string } | null>("quranpro:reciter", null);
      if (r) { setReciterId(r.id); setReciterName(r.name); }
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
    const onTime = () => setCurrentTime(a.currentTime);
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
  const stateRef = useRef({ surah, surahs, reciterId, autoplay });
  useEffect(() => { stateRef.current = { surah, surahs, reciterId, autoplay }; });

  const handleEnded = () => {
    const { autoplay: ap } = stateRef.current;
    if (ap) doNext();
  };

  const playSurah = useCallback(async (s: Surah) => {
    const a = audioRef.current; if (!a) return;
    setSurah(s);
    setLoading(true);
    const src = fullSurahAudioUrl(reciterId, s.number, 128);
    a.pause();
    a.currentTime = 0;
    a.src = src;
    a.playbackRate = speed;
    // Pasi metadata te ngarkohet, ridergo me duration ne lock screen
    const onMetaOnce = () => {
      updateMediaSession(s);
      a.removeEventListener("loadedmetadata", onMetaOnce);
    };
    a.addEventListener("loadedmetadata", onMetaOnce);
    try {
      const dl = await isDownloaded(s.number, reciterId).catch(() => null);
      if (dl?.localUri) a.src = dl.localUri;
      await a.play();
    } catch (e) {
      console.warn("play failed", e);
    } finally {
      setLoading(false);
    }
    const entry: HistoryEntry = { surahNumber: s.number, reciterId, ts: Date.now() };
    const next = [entry, ...history.filter((h) => !(h.surahNumber === s.number && h.reciterId === reciterId))].slice(0, 50);
    setHistory(next); storageSet("quranpro:history", next);
    updateMediaSession(s);
  }, [reciterId, speed, history]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = useCallback(() => {
    const a = audioRef.current; if (!a || !surah) return;
    if (a.paused) a.play(); else a.pause();
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
    const a = audioRef.current; if (!a) return;
    a.currentTime = sec;
  }, []);

  const setReciter = (id: string, name: string) => {
    setReciterId(id); setReciterName(name);
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
  const setAutoplayP = (v: boolean) => { setAutoplay(v); storageSet("quranpro:autoplay", v); };
  const setSpeedP = (v: number) => {
    setSpeed(v); storageSet("quranpro:speed", v);
    if (audioRef.current) audioRef.current.playbackRate = v;
  };
  const toggleFavorite = (n: number) => {
    const next = favorites.includes(n) ? favorites.filter((x) => x !== n) : [...favorites, n];
    setFavorites(next); storageSet("quranpro:favorites", next);
  };

  // ---- MediaSession (lock-screen controls + background metadata) ----
  const updateMediaSession = (s: Surah) => {
    const dur = audioRef.current?.duration && isFinite(audioRef.current.duration)
      ? audioRef.current.duration : undefined;
    const meta = {
      title: `${s.englishName} — ${s.name}`,
      artist: reciterName,
      album: "Quran Pro",
      artwork: "/icon-512.png",
      duration: dur,
    };
    setNativeMetadata(meta);
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
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
      const a = audioRef.current; if (!a) return;
      const next = Math.max(0, Math.min((a.duration || 0), a.currentTime + offset));
      a.currentTime = next;
    };
    // Native handlers (Capacitor) — punojnë në lock screen
    setNativeHandlers({
      play: () => audioRef.current?.play(),
      pause: () => audioRef.current?.pause(),
      stop: () => { const a = audioRef.current; if (a) { a.pause(); a.currentTime = 0; } },
      previousTrack: () => doPrev(),
      nextTrack: () => doNext(),
      seekTo: (sec) => { if (audioRef.current) audioRef.current.currentTime = sec; },
      seekForward: (off) => seekRel(off || 10),
      seekBackward: (off) => seekRel(-(off || 10)),
    });
    // Web fallback
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    const setMediaAction = (action: MediaSessionAction, handler: MediaSessionActionHandler) => {
      try { navigator.mediaSession.setActionHandler(action, handler); } catch {}
    };
    setMediaAction("play", () => audioRef.current?.play());
    setMediaAction("pause", () => audioRef.current?.pause());
    setMediaAction("previoustrack", () => doPrev());
    setMediaAction("nexttrack", () => doNext());
    setMediaAction("seekforward", (e) => seekRel(e.seekOffset ?? 10));
    setMediaAction("seekbackward", (e) => seekRel(-(e.seekOffset ?? 10)));
    setMediaAction("seekto", (e) => {
      if (!audioRef.current || e.seekTime == null) return;
      // Nese eshte fastSeek (drag), perdor fastSeek; perndryshe set direkt
      if (e.fastSeek && "fastSeek" in audioRef.current) {
        (audioRef.current as any).fastSeek(e.seekTime);
      } else {
        audioRef.current.currentTime = e.seekTime;
      }
    });
    return () => {
      ["play","pause","previoustrack","nexttrack","seekto","seekforward","seekbackward"].forEach((k) => {
        try { navigator.mediaSession.setActionHandler(k as MediaSessionAction, null); } catch {}
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update playback position state (web + native) — sinkronizon scrubber-in
  useEffect(() => {
    if (!duration || !isFinite(duration)) return;
    if (typeof navigator !== "undefined" && "mediaSession" in navigator) {
      try {
        navigator.mediaSession.setPositionState({
          duration, position: Math.min(currentTime, duration), playbackRate: speed,
        });
      } catch {}
    }
    const nativeState = isPlaying ? "playing" : "paused";
    const position = Math.min(currentTime, duration);
    const now = Date.now();
    const last = nativeSyncRef.current;
    if (last.state !== nativeState || Math.abs(last.position - position) >= 5 || now - last.at >= 5000) {
      nativeSyncRef.current = { at: now, state: nativeState, position };
      setNativePlaybackState(nativeState, position, duration, speed);
    }
  }, [currentTime, duration, speed, isPlaying]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? "playing" : "paused";
  }, [isPlaying]);

  const value = useMemo<PlayerCtx>(() => ({
    surah, reciterId, reciterName, isPlaying, currentTime, duration, loading, autoplay, speed,
    surahs, setSurahs, setReciter, setAutoplay: setAutoplayP, setSpeed: setSpeedP,
    play: playSurah, toggle, next, prev, seek,
    history, favorites, toggleFavorite,
  }), [surah, reciterId, reciterName, isPlaying, currentTime, duration, loading, autoplay, speed, surahs, history, favorites, playSurah, toggle, next, prev, seek]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlayer() {
  const v = useContext(Ctx);
  if (!v) throw new Error("usePlayer must be inside PlayerProvider");
  return v;
}
