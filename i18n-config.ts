import { enUS, fr, de, it } from 'date-fns/locale';

const localeMap = {
  'en-US': enUS,
  'fr': fr,
  'de': de,
  'it': it
};

export function getLocale(localeString) {
  return localeMap[localeString];
}

export const i18n = {
  defaultLocale: "en-US",
  locales: ["en-US"],
} as const;
  
export type Locale = (typeof i18n)["locales"][number];