// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// @ts-ignore
import en from "@/locales/en.json";
// @ts-ignore
import az from "@/locales/az.json";
// @ts-ignore
import ru from "@/locales/ru.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: en,
    },
    az: {
      translation: az,
    },
    ru: {
      translation: ru,
    },
  },
  lng: localStorage.getItem("allianceLanguage") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
