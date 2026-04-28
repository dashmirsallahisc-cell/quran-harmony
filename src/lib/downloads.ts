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
    // Stream-fetch then write base64 to filesystem
    const res = await fetch(url);
    const reader = res.body?.getReader();
    const total = Number(res.headers.get("content-length") || 0);
    const chunks: Uint8Array[] = [];
    let received = 0;
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          chunks.push(value);
          received += value.length;
          if (total) onProgress?.(Math.round((received / total) * 100));
        }
      }
    } else {
      const buf = new Uint8Array(await res.arrayBuffer());
      chunks.push(buf);
    }
    const blob = new Blob(chunks);
    const base64 = await blobToBase64(blob);
    const written = await Filesystem.writeFile({
      path: fileName,
      data: base64,
      directory: Directory.Data,
    });
    localUri = Capacitor.convertFileSrc(written.uri);
  } else {
    const res = await fetch(url);
    const blob = await res.blob();
    onProgress?.(100);
    localUri = URL.createObjectURL(blob);
  }

  const entry: DownloadEntry = {
    surahNumber, reciterId, url, localUri, fileName, ts: Date.now(),
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
    try { await Filesystem.deleteFile({ path: target.fileName, directory: Directory.Data }); } catch {}
  }
  await storageSet(KEY, all.filter((d) => d !== target));
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onloadend = () => {
      const result = r.result as string;
      resolve(result.split(",")[1]); // strip data:...;base64,
    };
    r.onerror = reject;
    r.readAsDataURL(blob);
  });
}
