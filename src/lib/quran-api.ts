// AlQuran.cloud API wrapper
const BASE = "https://api.alquran.cloud/v1";
const CDN = "https://cdn.islamic.network/quran/audio";

export interface Surah {
  number: number;
  name: string;            // Arabic
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Reciter {
  identifier: string;      // e.g. ar.alafasy
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  bitrate?: string;        // 128, 64, 40 ...
}

export interface Ayah {
  number: number;
  audio: string;
  audioSecondary?: string[];
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

export interface SurahDetail extends Surah {
  ayahs: Ayah[];
  edition: { identifier: string; language: string; name: string; englishName: string };
}

export const FULL_SURAH_RECITERS: Reciter[] = [
  { identifier: "ar.alafasy", language: "ar", name: "مشاري العفاسي", englishName: "Mishary Alafasy", format: "audio", type: "surahbyverse", bitrate: "128" },
  { identifier: "ar.abdullahbasfar", language: "ar", name: "عبد الله بصفر", englishName: "Abdullah Basfar", format: "audio", type: "surahbyverse", bitrate: "128" },
];

export async function fetchSurahs(): Promise<Surah[]> {
  const res = await fetch(`${BASE}/surah`);
  const json = await res.json();
  return json.data;
}

export async function fetchReciters(): Promise<Reciter[]> {
  // Full-surah player uses audio-surah CDN; most API reciters are verse-by-verse only
  // and return 404 for full-surah MP3s, which made Android look frozen after selection.
  return FULL_SURAH_RECITERS;
}

export async function fetchTranslations(): Promise<Reciter[]> {
  const res = await fetch(`${BASE}/edition?format=text&type=translation`);
  const json = await res.json();
  return json.data as Reciter[];
}

export async function fetchSurahAudio(
  surahNumber: number,
  reciterId: string,
): Promise<SurahDetail> {
  const res = await fetch(`${BASE}/surah/${surahNumber}/${reciterId}`);
  const json = await res.json();
  return json.data;
}

export async function fetchSurahWithTranslation(
  surahNumber: number,
  translationId: string,
): Promise<SurahDetail> {
  const res = await fetch(`${BASE}/surah/${surahNumber}/${translationId}`);
  const json = await res.json();
  return json.data;
}

export async function fetchSurahArabic(surahNumber: number): Promise<SurahDetail> {
  const res = await fetch(`${BASE}/surah/${surahNumber}/quran-uthmani`);
  const json = await res.json();
  return json.data;
}

/** Build a full-surah MP3 URL (one file per surah) */
export function fullSurahAudioUrl(reciterIdentifier: string, surahNumber: number, bitrate = 128) {
  // The full-surah CDN expects the complete edition id, e.g. `ar.alafasy`.
  const folder = reciterIdentifier;
  return `${CDN}-surah/${bitrate}/${folder}/${surahNumber}.mp3`;
}
