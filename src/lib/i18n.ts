// Lightweight i18n — UI strings + supported languages
// Each language code maps to a translation edition on AlQuran.cloud

export interface LanguageMeta {
  code: string;          // ISO-ish UI code
  name: string;          // shown in selector
  translationId: string; // alquran.cloud edition identifier
  ui: Record<string, string>;
}

const en = {
  appTitle: "Quran Pro",
  reciter: "Reciter",
  favorites: "Favorites",
  downloads: "Downloads",
  history: "History",
  settings: "Settings",
  surahs: "Surahs",
  juz: "Juz",
  verses: "Verses",
  home: "Home",
  player: "Player",
  bookmarks: "Bookmarks",
  more: "More",
  nowPlaying: "Now Playing",
  selectReciter: "Select reciter",
  selectLanguage: "Select language",
  theme: "Theme",
  dark: "Dark",
  light: "Light",
  green: "Green",
  download: "Download",
  downloaded: "Downloaded",
  remove: "Remove",
  noBookmarks: "No bookmarks yet",
  noHistory: "No history yet",
  noDownloads: "No downloads yet",
  searchSurah: "Search surah...",
  about: "About",
  createdBy: "Created by DS Interactive — Dashmir Sallahi",
  autoplay: "Auto-play next surah",
  playbackSpeed: "Playback speed",
  translation: "Translation",
  showTranslation: "Show translation",
  loading: "Loading...",
  retry: "Retry",
};

type UI = typeof en;
const t = (overrides: Partial<UI>): UI => ({ ...en, ...overrides });

export const LANGUAGES: LanguageMeta[] = [
  { code: "en",  name: "English",            translationId: "en.sahih",          ui: en },
  { code: "sq",  name: "Shqip",              translationId: "sq.nahi",           ui: t({ appTitle:"Kuran Pro", reciter:"Recitues", favorites:"Të preferuarat", downloads:"Shkarkimet", history:"Historiku", settings:"Cilësimet", surahs:"Suret", juz:"Xhuz", verses:"Vargje", home:"Ballina", player:"Luajtësi", bookmarks:"Faqeruajtësit", more:"Më shumë", nowPlaying:"Po luan", selectReciter:"Zgjidh recitues", selectLanguage:"Zgjidh gjuhën", theme:"Tema", dark:"Errët", light:"Ndriçuar", green:"Gjelbër", download:"Shkarko", downloaded:"E shkarkuar", remove:"Hiq", noBookmarks:"Asnjë faqeruajtës", noHistory:"Asnjë histori", noDownloads:"Asnjë shkarkim", searchSurah:"Kërko sure...", about:"Rreth", createdBy:"Krijuar nga DS Interactive — Dashmir Sallahi", autoplay:"Luaj automatikisht suren tjetër", playbackSpeed:"Shpejtësia", translation:"Përkthimi", showTranslation:"Shfaq përkthimin", loading:"Duke ngarkuar...", retry:"Provo përsëri" }) },
  { code: "ar",  name: "العربية",            translationId: "quran-uthmani",     ui: t({ appTitle:"القرآن برو", reciter:"القارئ", favorites:"المفضلة", downloads:"التنزيلات", history:"السجل", settings:"الإعدادات", surahs:"السور", juz:"الجزء", verses:"الآيات", home:"الرئيسية", player:"المشغل", bookmarks:"الإشارات", more:"المزيد", nowPlaying:"يعمل الآن", selectReciter:"اختر القارئ", selectLanguage:"اختر اللغة", theme:"السمة", dark:"داكن", light:"فاتح", green:"أخضر", download:"تنزيل", downloaded:"تم التنزيل", remove:"إزالة", noBookmarks:"لا توجد إشارات", noHistory:"لا يوجد سجل", noDownloads:"لا توجد تنزيلات", searchSurah:"بحث عن سورة...", about:"حول", createdBy:"تم إنشاؤه بواسطة DS Interactive — Dashmir Sallahi", autoplay:"تشغيل السورة التالية", playbackSpeed:"السرعة", translation:"الترجمة", showTranslation:"عرض الترجمة", loading:"جار التحميل...", retry:"إعادة المحاولة" }) },
  { code: "tr",  name: "Türkçe",             translationId: "tr.diyanet",        ui: t({ appTitle:"Kuran Pro", reciter:"Hafız", favorites:"Favoriler", downloads:"İndirilenler", history:"Geçmiş", settings:"Ayarlar", surahs:"Sureler", juz:"Cüz", verses:"Ayet", home:"Ana sayfa", player:"Oynatıcı", bookmarks:"Yer imleri", more:"Daha fazla", nowPlaying:"Çalıyor", selectReciter:"Hafız seç", selectLanguage:"Dil seç", theme:"Tema", dark:"Koyu", light:"Açık", green:"Yeşil", download:"İndir", downloaded:"İndirildi", remove:"Kaldır", noBookmarks:"Yer imi yok", noHistory:"Geçmiş yok", noDownloads:"İndirme yok", searchSurah:"Sure ara...", about:"Hakkında", createdBy:"DS Interactive tarafından oluşturuldu — Dashmir Sallahi", autoplay:"Sonraki sureyi otomatik oynat", playbackSpeed:"Hız", translation:"Çeviri", showTranslation:"Çeviriyi göster", loading:"Yükleniyor...", retry:"Tekrar dene" }) },
  { code: "ur",  name: "اردو",                translationId: "ur.jalandhry",      ui: t({ appTitle:"قرآن پرو" }) },
  { code: "fr",  name: "Français",           translationId: "fr.hamidullah",     ui: t({ home:"Accueil", player:"Lecteur", settings:"Paramètres", reciter:"Récitateur", favorites:"Favoris", downloads:"Téléchargements", history:"Historique", more:"Plus", surahs:"Sourates", juz:"Juz", verses:"Versets", searchSurah:"Rechercher...", theme:"Thème", dark:"Sombre", light:"Clair", green:"Vert", download:"Télécharger", autoplay:"Lecture auto" }) },
  { code: "es",  name: "Español",            translationId: "es.cortes",         ui: t({ home:"Inicio", player:"Reproductor", settings:"Ajustes", reciter:"Recitador", favorites:"Favoritos", downloads:"Descargas", history:"Historial", more:"Más", surahs:"Suras", verses:"Versículos", theme:"Tema", dark:"Oscuro", light:"Claro", green:"Verde" }) },
  { code: "de",  name: "Deutsch",            translationId: "de.aburida",        ui: t({ home:"Start", player:"Player", settings:"Einstellungen", reciter:"Rezitator", favorites:"Favoriten", downloads:"Downloads", history:"Verlauf", more:"Mehr", surahs:"Suren", verses:"Verse", theme:"Design", dark:"Dunkel", light:"Hell", green:"Grün" }) },
  { code: "id",  name: "Bahasa Indonesia",   translationId: "id.indonesian",     ui: t({ home:"Beranda", player:"Pemutar", settings:"Pengaturan", reciter:"Qori", favorites:"Favorit", downloads:"Unduhan", history:"Riwayat", more:"Lainnya", surahs:"Surat", verses:"Ayat" }) },
  { code: "ms",  name: "Bahasa Melayu",      translationId: "ms.basmeih",        ui: t({ home:"Utama", player:"Pemain", settings:"Tetapan", reciter:"Qari", favorites:"Kegemaran", downloads:"Muat turun" }) },
  { code: "ru",  name: "Русский",            translationId: "ru.kuliev",         ui: t({ home:"Главная", player:"Плеер", settings:"Настройки", reciter:"Чтец", favorites:"Избранное", downloads:"Загрузки", history:"История", more:"Ещё", surahs:"Суры", verses:"Аяты", theme:"Тема", dark:"Тёмная", light:"Светлая", green:"Зелёная" }) },
  { code: "it",  name: "Italiano",           translationId: "it.piccardo",       ui: t({ home:"Home", player:"Lettore", settings:"Impostazioni", reciter:"Recitatore" }) },
  { code: "nl",  name: "Nederlands",         translationId: "nl.leemhuis",       ui: t({ home:"Start", player:"Speler", settings:"Instellingen" }) },
  { code: "pl",  name: "Polski",             translationId: "pl.bielawskiego",   ui: t({ home:"Start", player:"Odtwarzacz", settings:"Ustawienia" }) },
  { code: "pt",  name: "Português",          translationId: "pt.elhayek",        ui: t({ home:"Início", player:"Reprodutor", settings:"Configurações" }) },
  { code: "sv",  name: "Svenska",            translationId: "sv.bernstrom",      ui: t({ home:"Hem", player:"Spelare", settings:"Inställningar" }) },
  { code: "no",  name: "Norsk",              translationId: "no.berg",           ui: t({ home:"Hjem", player:"Spiller", settings:"Innstillinger" }) },
  { code: "fa",  name: "فارسی",              translationId: "fa.makarem",        ui: t({}) },
  { code: "az",  name: "Azərbaycan",         translationId: "az.musayev",        ui: t({}) },
  { code: "uz",  name: "Oʻzbek",             translationId: "uz.sodik",          ui: t({}) },
  { code: "bn",  name: "বাংলা",              translationId: "bn.bengali",        ui: t({}) },
  { code: "hi",  name: "हिन्दी",              translationId: "hi.hindi",          ui: t({}) },
  { code: "ta",  name: "தமிழ்",              translationId: "ta.tamil",          ui: t({}) },
  { code: "th",  name: "ไทย",                translationId: "th.thai",           ui: t({}) },
  { code: "zh",  name: "中文",                translationId: "zh.jian",           ui: t({}) },
  { code: "ja",  name: "日本語",              translationId: "ja.japanese",       ui: t({}) },
  { code: "ko",  name: "한국어",              translationId: "ko.korean",         ui: t({}) },
  { code: "ku",  name: "Kurdî",              translationId: "ku.asan",           ui: t({}) },
  { code: "so",  name: "Soomaali",           translationId: "so.abduh",          ui: t({}) },
  { code: "sw",  name: "Kiswahili",          translationId: "sw.barwani",        ui: t({}) },
  { code: "ha",  name: "Hausa",              translationId: "ha.gumi",           ui: t({}) },
  { code: "ro",  name: "Română",             translationId: "ro.grigore",        ui: t({}) },
  { code: "cs",  name: "Čeština",            translationId: "cs.hrbek",          ui: t({}) },
];

export function getLanguage(code: string): LanguageMeta {
  return LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
}
