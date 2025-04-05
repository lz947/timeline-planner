export type Locale = (typeof locales)[number];

export const locales = ["en", "zh"] as const;
export const defaultLocale: Locale = "en";

export const localNames = {
  "en": "English",
  "zh": "简体中文"
};