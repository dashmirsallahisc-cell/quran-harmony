// Wrapper për @capacitor-community/media-session
// Përdoret VETËM në Android/iOS (Capacitor). Në web fallback-on tek
// navigator.mediaSession standard.
//
// Plugin-i instalohet lokalisht me:
//   npm install @capacitor-community/media-session
//   npx cap sync android
//
// Importi është dynamic që build-i të mos thyhet kur plugin-i mungon
// (p.sh. në preview-n web të Lovable).

import { Capacitor } from "@capacitor/core";

type ActionHandler = () => void;
type SeekHandler = (sec: number) => void;

interface Handlers {
  play?: ActionHandler;
  pause?: ActionHandler;
  previousTrack?: ActionHandler;
  nextTrack?: ActionHandler;
  seekTo?: SeekHandler;
}

let pluginPromise: Promise<any> | null = null;
async function loadPlugin() {
  if (!Capacitor.isNativePlatform()) return null;
  if (!pluginPromise) {
    // Dynamic import me string literal qe Vite e di si ta lere optional.
    // Wrapped ne try/catch sepse plugin-i mund te mos jete instaluar.
    pluginPromise = (async () => {
      try {
        // @ts-ignore - plugin opsional, mund te mos jete i instaluar
        const m: any = await import(/* @vite-ignore */ "@capacitor-community/media-session");
        return m.MediaSession ?? m.default ?? m;
      } catch (e) {
        console.warn("[media-session] plugin nuk u ngarkua:", e);
        return null;
      }
    })();
  }
  return pluginPromise;
}

export async function setNativeMetadata(opts: {
  title: string;
  artist: string;
  album: string;
  artwork?: string;
  duration?: number;
}) {
  const p = await loadPlugin();
  if (!p) return;
  try {
    await p.setMetadata({
      title: opts.title,
      artist: opts.artist,
      album: opts.album,
      artwork: opts.artwork ? [{ src: opts.artwork, sizes: "512x512", type: "image/png" }] : [],
      duration: opts.duration,
    });
  } catch (e) {
    console.warn("[media-session] setMetadata failed", e);
  }
}

export async function setNativePlaybackState(state: "playing" | "paused" | "none", position?: number, duration?: number) {
  const p = await loadPlugin();
  if (!p) return;
  try {
    await p.setPlaybackState({ playbackState: state });
    if (position != null && duration != null) {
      await p.setPositionState({ duration, position, playbackRate: 1 });
    }
  } catch (e) {
    console.warn("[media-session] setPlaybackState failed", e);
  }
}

export async function setNativeHandlers(h: Handlers) {
  const p = await loadPlugin();
  if (!p) return;
  const wrap = (action: string, fn?: (...a: any[]) => void) => {
    try {
      if (fn) p.setActionHandler({ action }, fn);
      else p.setActionHandler({ action }, null);
    } catch (e) {
      console.warn("[media-session] setActionHandler", action, e);
    }
  };
  wrap("play", h.play);
  wrap("pause", h.pause);
  wrap("previoustrack", h.previousTrack);
  wrap("nexttrack", h.nextTrack);
  wrap("seekto", h.seekTo ? (d: any) => h.seekTo!(d?.seekTime ?? 0) : undefined);
}
