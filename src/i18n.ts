import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationEn from "../public/locales/en/translation.json";
import translationPt from "../public/locales/pt/translation.json";
import { LocalStorageKeys } from "./storage/keys";

export interface LanguageType {
  lng: string;
}

const language = JSON.parse(
  localStorage.getItem(LocalStorageKeys.LANGUAGE) || '{"lng": "en"}'
) as LanguageType;

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: translationEn,
    },
    pt: {
      translation: translationPt,
    },
  },
  lng: language.lng,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
});

export { i18n };
