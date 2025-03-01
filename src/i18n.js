import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslation from "./locales/en.json";
import ruTranslation from "./locales/ru.json";
import uzTranslation from "./locales/uz.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      ru: { translation: ruTranslation },
      uz: { translation: uzTranslation },
    },
    lng: localStorage.getItem("lng") || navigator.language.split("-")[0], // Brauzer tilini

    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
