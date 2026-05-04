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

// Native plugin intentionally disabled: Android WebView was freezing on route changes
// when the Capacitor bridge received repeated media-session updates. The app now uses
// the browser MediaSession API from PlayerContext only, which is stable and supports
// play/pause/next/previous/seek on compatible Android lock screens.
export async function setNativeMetadata(_opts: {
  title: string;
  artist: string;
  album: string;
  artwork?: string;
  duration?: number;
}) {}

export async function setNativePlaybackState(
  _state: "playing" | "paused" | "none",
  _position?: number,
  _duration?: number,
  _playbackRate: number = 1,
) {}

export async function setNativeHandlers(_h: Handlers) {}
