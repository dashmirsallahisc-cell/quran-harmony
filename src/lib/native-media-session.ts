// Wrapper për `@capgo/capacitor-media-session` (Capacitor 8)
// Përdoret VETËM në Android/iOS (Capacitor). Në web fallback-on tek
// navigator.mediaSession standard.
//
// Plugin-i instalohet lokalisht me:
//   npm install @capgo/capacitor-media-session
//   npx cap sync android

import { Capacitor } from "@capacitor/core";
import { MediaSession } from "@capgo/capacitor-media-session";

type ActionHandler = () => void;
type SeekHandler = (sec: number) => void;
type SeekRelHandler = (offset: number) => void;

interface Handlers {
  play?: ActionHandler;
  pause?: ActionHandler;
  stop?: ActionHandler;
  previousTrack?: ActionHandler;
  nextTrack?: ActionHandler;
  seekTo?: SeekHandler;
  seekForward?: SeekRelHandler;
  seekBackward?: SeekRelHandler;
}

let pluginPromise: Promise<any> | null = null;
async function loadPlugin() {
  if (!Capacitor.isNativePlatform()) return null;
  if (!pluginPromise) {
    pluginPromise = (async () => {
      try {
        return MediaSession;
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

export async function setNativePlaybackState(
  state: "playing" | "paused" | "none",
  position?: number,
  duration?: number,
  playbackRate: number = 1,
) {
  const p = await loadPlugin();
  if (!p) return;
  try {
    await p.setPlaybackState({ playbackState: state });
    if (position != null && duration != null && duration > 0) {
      await p.setPositionState({ duration, position, playbackRate });
    }
  } catch (e) {
    console.warn("[media-session] setPlaybackState failed", e);
  }
}

export async function setNativeHandlers(h: Handlers) {
  const p = await loadPlugin();
  if (!p) return;
  const wrap = async (action: string, fn?: (...a: any[]) => void) => {
    try {
      if (fn) await p.setActionHandler({ action }, fn);
      else await p.setActionHandler({ action }, null);
    } catch (e) {
      console.warn("[media-session] setActionHandler", action, e);
    }
  };
  await Promise.all([
    wrap("play", h.play),
    wrap("pause", h.pause),
    wrap("stop", h.stop),
    wrap("previoustrack", h.previousTrack),
    wrap("nexttrack", h.nextTrack),
    wrap("seekto", h.seekTo ? (d: any) => h.seekTo!(d?.seekTime ?? 0) : undefined),
    wrap("seekforward", h.seekForward ? () => h.seekForward!(10) : undefined),
    wrap("seekbackward", h.seekBackward ? () => h.seekBackward!(10) : undefined),
  ]);
}

