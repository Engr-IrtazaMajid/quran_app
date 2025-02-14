import { Ayah } from '../types/quran';

export const getCacheKey = (surahNumber: string, language: string) =>
  `${surahNumber}-${language}`;

export const createTranslationsMap = (ayahs: Ayah[], language: string) =>
  ayahs.reduce(
    (acc, ayah) => ({
      ...acc,
      [ayah.number]: ayah.translations?.[language] || '',
    }),
    {}
  );

export const mapAyahsWithTranslations = (
  ayahs: Ayah[],
  translations: { [key: number]: string },
  language: string,
  withTranslation: boolean
) =>
  ayahs.map((ayah) => ({
    ...ayah,
    translations: withTranslation
      ? {
          ...ayah.translations,
          [language]: translations[ayah.number],
        }
      : ayah.translations,
  }));
