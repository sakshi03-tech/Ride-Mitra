import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import mrTranslation from "../locales/mr.json";
import enTranslation from "../locales/en.json";

const resources = {
  mr: { translation: mrTranslation },
  en: { translation: enTranslation },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "mr", // Marathi first as per product spec
    supportedLngs: ["mr", "en"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

// Update html lang attribute on change
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
});

export default i18n;
