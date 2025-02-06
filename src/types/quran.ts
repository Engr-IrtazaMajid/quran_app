export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  translation?: string;
  urduTranslation?: string;
  audio?: string;
  urduAudio?: string;
}

export interface Reciter {
  id: string;
  name: string;
  style?: string;
  language?: 'ar' | 'ur';
}

export interface AudioSettings {
  withTranslation: boolean;
}
