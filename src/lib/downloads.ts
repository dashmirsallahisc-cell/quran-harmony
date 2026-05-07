// Download management using Capacitor Filesystem on native, fallback to fetch+blob URL on web.
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { storageGet, storageSet } from "./storage";

const KEY = "quranpro:downloads";

export interface DownloadEntry {
  surahNumber: number;
  reciterId: string;
  url: string;
  localUri?: string; // file:// or blob: URL
  fileName: string;
  ts: number;
}

const fileNameFor = (surahNumber: number, reciterId: string) =>
  `quranpro-${reciterId.replace(/[^a-z0-9.]/gi, "_")}-${surahNumber}.mp3`;

export async function getDownloads(): Promise<DownloadEntry[]> {
  return storageGet<DownloadEntry[]>(KEY, []);
}

export async function isDownloaded(surahNumber: number, reciterId: string) {
  const all = await getDownloads();
  return all.find((d) => d.surahNumber === surahNumber && d.reciterId === reciterId);
}

export async function downloadSurah(
  surahNumber: number,
  reciterId: string,
  url: string,
  onProgress?: (pct: number) => void,
): Promise<DownloadEntry> {
  const fileName = fileNameFor(surahNumber, reciterId);
  let localUri: string | undefined;

  if (Capacitor.isNativePlatform()) {
    const listener = onProgress
      ? await Filesystem.addListener("progress", ({ bytes, contentLength }) => {
          if (contentLength > 0) onProgress(Math.round((bytes / contentLength) * 100));
        })
      : undefined;
    try {
      const downloaded = await Filesystem.downloadFile({
        url,
        path: fileName,
        directory: Directory.Data,
        progress: !!onProgress,
        recursive: true,
      });
      const uri =
        downloaded.path ?? (await Filesystem.getUri({ path: fileName, directory: Directory.Data })).uri;
      localUri = Capacitor.convertFileSrc(uri);
      onProgress?.(100);
    } finally {
      await listener?.remove();
    }
  } else {
    const res = await fetch(url);
    const blob = await res.blob();
    onProgress?.(100);
    localUri = URL.createObjectURL(blob);
  }

  const entry: DownloadEntry = {
    surahNumber,
    reciterId,
    url,
    localUri,
    fileName,
    ts: Date.now(),
  };
  const all = await getDownloads();
  const filtered = all.filter((d) => !(d.surahNumber === surahNumber && d.reciterId === reciterId));
  filtered.unshift(entry);
  await storageSet(KEY, filtered);
  return entry;
}

export async function removeDownload(surahNumber: number, reciterId: string) {
  const all = await getDownloads();
  const target = all.find((d) => d.surahNumber === surahNumber && d.reciterId === reciterId);
  if (target && Capacitor.isNativePlatform()) {
    try {
      await Filesystem.deleteFile({ path: target.fileName, directory: Directory.Data });
    } catch {
      // File may already be gone; keep stored list in sync anyway.
    }
  }
  await storageSet(
    KEY,
    all.filter((d) => d !== target),
  );
}
