import { enUS, fr, de, it, ja } from 'date-fns/locale';

//TODO: Uncomment to enable language modes
/*
const localeMap = {
  'en-US': enUS,
  'de': de,
  'fr': fr,
  'it': it,
  'jp': ja
};
*/

const localeMap = {
  'en-US': enUS,
};
export function parseLocale(localeString) {
  return localeMap[localeString];
}

//TODO: Uncomment to enable language modes
/*
export const i18n = {
  defaultLocale: "en-US",
  locales: ["en-US", "de", "fr", "it", "jp"],
} as const;
 */

export const i18n = {
  defaultLocale: "en-US",
  locales: ["en-US"],
} as const;
  
export type Locale = (typeof i18n)["locales"][number];