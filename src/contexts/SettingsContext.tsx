import { createContext, useContext, useEffect, useState } from "react";
import { storageGet, storageSet } from "@/lib/storage";
import { LANGUAGES, getLanguage, type LanguageMeta } from "@/lib/i18n";

type Theme = "dark" | "light" | "green";

interface SettingsCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
  language: string;
  setLanguage: (code: string) => void;
  lang: LanguageMeta;
  showTranslation: boolean;
  setShowTranslation: (v: boolean) => void;
}

const Ctx = createContext<SettingsCtx | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [language, setLanguageState] = useState("en");
  const [showTranslation, setShowTranslationState] = useState(true);

  useEffect(() => {
    (async () => {
      setThemeState(await storageGet<Theme>("quranpro:theme", "dark"));
      setLanguageState(await storageGet("quranpro:lang", "en"));
      setShowTranslationState(await storageGet("quranpro:showTranslation", true));
    })();
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    root.classList.remove("dark", "light", "green");
    root.classList.add(theme);
  }, [theme]);

  const setTheme = (t: Theme) => { setThemeState(t); storageSet("quranpro:theme", t); };
  const setLanguage = (c: string) => { setLanguageState(c); storageSet("quranpro:lang", c); };
  const setShowTranslation = (v: boolean) => { setShowTranslationState(v); storageSet("quranpro:showTranslation", v); };

  return (
    <Ctx.Provider value={{
      theme, setTheme, language, setLanguage, lang: getLanguage(language),
      showTranslation, setShowTranslation,
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useSettings() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSettings must be inside SettingsProvider");
  return v;
}
export { LANGUAGES };
