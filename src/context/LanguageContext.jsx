import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LANG_OPTIONS,
  STORAGE_KEY,
  translations,
} from "../i18n/translations";

export const LanguageContext = createContext({
  language: "en",
  languageLabel: "English",
  setLanguageByLabel: () => {},
  setLanguage: () => {},
  t: (key) => key,
  options: LANG_OPTIONS,
});

const resolveInitial = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && translations[saved]) return saved;
  } catch {
    /* ignore */
  }
  return "en";
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(resolveInitial);

  useEffect(() => {
    const opt = LANG_OPTIONS.find((o) => o.id === language);
    document.documentElement.lang = opt?.htmlLang || "en";
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch {
      /* ignore */
    }
  }, [language]);

  const setLanguage = useCallback((id) => {
    if (translations[id]) setLanguageState(id);
  }, []);

  const setLanguageByLabel = useCallback((label) => {
    const opt = LANG_OPTIONS.find(
      (o) => o.label.toLowerCase() === String(label).toLowerCase()
    );
    if (opt) setLanguageState(opt.id);
  }, []);

  const t = useCallback(
    (key) => translations[language]?.[key] ?? translations.en[key] ?? key,
    [language]
  );

  const languageLabel =
    LANG_OPTIONS.find((o) => o.id === language)?.label || "English";

  const value = useMemo(
    () => ({
      language,
      languageLabel,
      setLanguage,
      setLanguageByLabel,
      t,
      options: LANG_OPTIONS,
    }),
    [language, languageLabel, setLanguage, setLanguageByLabel, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

export default LanguageProvider;
