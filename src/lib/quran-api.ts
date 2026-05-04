// AlQuran.cloud API wrapper
const BASE = "https://api.alquran.cloud/v1";
const CDN = "https://cdn.islamic.network/quran/audio";

export interface Surah {
  number: number;
  name: string; // Arabic
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Reciter {
  identifier: string; // e.g. ar.alafasy
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
  bitrate?: string; // 128, 64, 40 ...
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

export interface FullSurahReciter extends Reciter {
  server?: string;
}

export const FULL_SURAH_RECITERS: FullSurahReciter[] = [
  {
    identifier: "mp3quran:afs",
    server: "https://server8.mp3quran.net/afs/",
    language: "ar",
    name: "مشاري العفاسي",
    englishName: "Mishary Alafasy",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:maher",
    server: "https://server12.mp3quran.net/maher/",
    language: "ar",
    name: "ماهر المعيقلي",
    englishName: "Maher Al Muaiqly",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:basit",
    server: "https://server7.mp3quran.net/basit/",
    language: "ar",
    name: "عبد الباسط عبد الصمد",
    englishName: "Abdul Basit Abdulsamad",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:minsh",
    server: "https://server10.mp3quran.net/minsh/",
    language: "ar",
    name: "محمد صديق المنشاوي",
    englishName: "Mohamed Siddiq Al-Minshawi",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:husr",
    server: "https://server13.mp3quran.net/husr/",
    language: "ar",
    name: "محمود خليل الحصري",
    englishName: "Mahmoud Khalil Al-Hussary",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:s_gmd",
    server: "https://server7.mp3quran.net/s_gmd/",
    language: "ar",
    name: "سعد الغامدي",
    englishName: "Saad Al-Ghamdi",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:shur",
    server: "https://server7.mp3quran.net/shur/",
    language: "ar",
    name: "سعود الشريم",
    englishName: "Saud Al-Shuraim",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:shatri",
    server: "https://server11.mp3quran.net/shatri/",
    language: "ar",
    name: "أبو بكر الشاطري",
    englishName: "Abu Bakr Al-Shatri",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:ajm",
    server: "https://server10.mp3quran.net/ajm/",
    language: "ar",
    name: "أحمد العجمي",
    englishName: "Ahmad Al-Ajmy",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:qtm",
    server: "https://server6.mp3quran.net/qtm/",
    language: "ar",
    name: "ناصر القطامي",
    englishName: "Nasser Al-Qatami",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:yasser",
    server: "https://server11.mp3quran.net/yasser/",
    language: "ar",
    name: "ياسر الدوسري",
    englishName: "Yasser Al-Dosari",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:frs_a",
    server: "https://server8.mp3quran.net/frs_a/",
    language: "ar",
    name: "فارس عباد",
    englishName: "Fares Abbad",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:abkr",
    server: "https://server6.mp3quran.net/abkr/",
    language: "ar",
    name: "إدريس أبكر",
    englishName: "Idrees Abkar",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:jleel",
    server: "https://server10.mp3quran.net/jleel/",
    language: "ar",
    name: "خالد الجليل",
    englishName: "Khalid Al-Jaleel",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:balilah",
    server: "https://server6.mp3quran.net/balilah/",
    language: "ar",
    name: "بندر بليلة",
    englishName: "Bandar Balilah",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:kurdi",
    server: "https://server6.mp3quran.net/kurdi/",
    language: "ar",
    name: "رعد الكردي",
    englishName: "Raad Al-Kurdi",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:kamel",
    server: "https://server16.mp3quran.net/kamel/Rewayat-Hafs-A-n-Assem/",
    language: "ar",
    name: "عبد الله كامل",
    englishName: "Abdullah Kamel",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:jbrl",
    server: "https://server8.mp3quran.net/jbrl/",
    language: "ar",
    name: "محمد جبريل",
    englishName: "Mohammed Jibreel",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:alzain",
    server: "https://server9.mp3quran.net/alzain/",
    language: "ar",
    name: "الزين محمد أحمد",
    englishName: "Alzain Mohammad Ahmad",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:twfeeq",
    server: "https://server6.mp3quran.net/twfeeq/",
    language: "ar",
    name: "توفيق الصائغ",
    englishName: "Tawfeeq As-Sayegh",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:a_jbr",
    server: "https://server11.mp3quran.net/a_jbr/",
    language: "ar",
    name: "علي جابر",
    englishName: "Ali Jaber",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:s_bud",
    server: "https://server6.mp3quran.net/s_bud/",
    language: "ar",
    name: "صلاح البدير",
    englishName: "Salah Al-Budair",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:bu_khtr",
    server: "https://server8.mp3quran.net/bu_khtr/",
    language: "ar",
    name: "صلاح بو خاطر",
    englishName: "Salah Bukhatir",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:hani",
    server: "https://server8.mp3quran.net/hani/",
    language: "ar",
    name: "هاني الرفاعي",
    englishName: "Hani Ar-Rifai",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:arkani",
    server: "https://server6.mp3quran.net/arkani/",
    language: "ar",
    name: "عبد الولي الأركاني",
    englishName: "Abdulwali Al-Arkani",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:shl",
    server: "https://server6.mp3quran.net/shl/",
    language: "ar",
    name: "سهل ياسين",
    englishName: "Sahl Yassin",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:ayyub",
    server: "https://server8.mp3quran.net/ayyub/",
    language: "ar",
    name: "محمد أيوب",
    englishName: "Mohammed Ayyub",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:lhdan",
    server: "https://server8.mp3quran.net/lhdan/",
    language: "ar",
    name: "محمد اللحيدان",
    englishName: "Mohammed Al-Lohaidan",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:tblawi",
    server: "https://server12.mp3quran.net/tblawi/",
    language: "ar",
    name: "محمد الطبلاوي",
    englishName: "Mohammad Al-Tablawi",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:bna",
    server: "https://server8.mp3quran.net/bna/",
    language: "ar",
    name: "محمود علي البنا",
    englishName: "Mahmoud Ali Al-Banna",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:akdr",
    server: "https://server6.mp3quran.net/akdr/",
    language: "ar",
    name: "إبراهيم الأخضر",
    englishName: "Ibrahim Al-Akhdar",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
  {
    identifier: "mp3quran:akrm",
    server: "https://server9.mp3quran.net/akrm/",
    language: "ar",
    name: "أكرم العلاقمي",
    englishName: "Akram Al-Alaqmi",
    format: "audio",
    type: "surah",
    bitrate: "128",
  },
];

export async function fetchSurahs(): Promise<Surah[]> {
  const res = await fetch(`${BASE}/surah`);
  const json = await res.json();
  return json.data;
}

export async function fetchReciters(): Promise<Reciter[]> {
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
  const mp3QuranReciter = FULL_SURAH_RECITERS.find((r) => r.identifier === reciterIdentifier);
  if (mp3QuranReciter?.server) {
    return `${mp3QuranReciter.server.replace(/\/$/, "")}/${String(surahNumber).padStart(3, "0")}.mp3`;
  }

  return `${CDN}-surah/${bitrate}/${reciterIdentifier}/${surahNumber}.mp3`;
}
