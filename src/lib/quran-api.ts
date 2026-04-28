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

export async function fetchSurahs(): Promise<Surah[]> {
  const res = await fetch(`${BASE}/surah`);
  const json = await res.json();
  return json.data;
}

export async function fetchReciters(): Promise<Reciter[]> {
  const res = await fetch(`${BASE}/edition?format=audio&type=versebyverse`);
  const json = await res.json();
  return json.data as Reciter[];
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
  // strip ar. prefix; CDN folder is the identifier without prefix
  const folder = reciterIdentifier.replace(/^ar\./, "");
  return `${CDN}-surah/${bitrate}/${folder}/${surahNumber}.mp3`;
}
