import { enUS, fr, de, it, ja } from 'date-fns/locale';

const localeMap = {
  'en-US': enUS,
  'de': de,
  'fr': fr,
  'it': it,
  'jp': ja
};

export function parseLocale(localeString: string) {
  return localeMap[localeString];
}

export const i18n = {
  defaultLocale: "en-US",
  locales: ["en-US", "de", "fr", "it", "jp"],
} as const;

export type Locale = (typeof i18n)["locales"][number];