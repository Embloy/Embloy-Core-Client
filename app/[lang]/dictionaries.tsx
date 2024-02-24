
/*import { i18n } from '@/i18n-config'

const dictionaries = {
  'en-US': () => import('../../locales/en-US.json').then((module) => module.default),
  'fr': () => import('../../locales/en-US.json').then((module) => module.default),
  'de': () => import('../../locales/en-US.json').then((module) => module.default),
  'it': () => import('../../locales/en-US.json').then((module) => module.default),
  'jp': () => import('../../locales/en-US.json').then((module) => module.default),
}

export const getDictionary = async (locale) => dictionaries[i18n.locales.includes(locale) ? locale : i18n.defaultLocale]()
 */
import type { Locale } from "./../../i18n-config";

// We enumerate all dictionaries here for better linting and typescript support
// We also get the default import for cleaner types
const dictionaries = {
  en: () => import("../../locales/en-US.json").then((module) => module.default),
};

export const getDictionary = async (locale: Locale) =>
  dictionaries[locale]?.() ?? dictionaries.en();