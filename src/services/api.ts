import axios from 'axios';
import { Surah, Ayah, Reciter } from '../types/quran';

const api = axios.create({
  baseURL: 'https://api.alquran.cloud/v1',
});

export const fetchSurahs = async (): Promise<Surah[]> => {
  const response = await api.get('/surah');
  return response.data.data;
};

export const fetchAyahs = async (
  surahNumber: number,
  reciter: string = 'ar.alafasy',
  withTranslation: boolean = false
): Promise<Ayah[]> => {
  const [arabicResponse, urduResponse, urduAudioResponse] = await Promise.all([
    api.get(`/surah/${surahNumber}/${reciter}`),
    withTranslation ? api.get(`/surah/${surahNumber}/ur.jalandhry`) : null,
    withTranslation ? api.get(`/surah/${surahNumber}/ur.khan`) : null,
  ]);

  const arabicAyahs = arabicResponse.data.data.ayahs;
  const urduAyahs = urduResponse?.data.data.ayahs || [];
  const urduAudioAyahs = urduAudioResponse?.data.data.ayahs || [];

  return arabicAyahs.map((ayah: any, index: number) => ({
    ...ayah,
    urduTranslation: urduAyahs[index]?.text || '',
    urduAudio: urduAudioAyahs[index]?.audio || '',
  }));
};

export const fetchReciters = async (): Promise<Reciter[]> => {
  const response = await api.get('/edition/format/audio');
  const reciters = response.data.data
    .filter(
      (reciter: any) =>
        reciter.language === 'ar' ||
        (reciter.language === 'ur' && reciter.identifier === 'ur.khan')
    )
    .map((reciter: any) => ({
      id: reciter.identifier,
      name: reciter.englishName,
      style: reciter.type,
      language: reciter.language as 'ar' | 'ur',
    }));

  // Add Urdu translation reciter if not present
  const hasUrduReciter = reciters.some((r: any) => r.language === 'ur');
  if (!hasUrduReciter) {
    reciters.push({
      id: 'ur.khan',
      name: 'Urdu Translation',
      style: 'translation',
      language: 'ur',
    });
  }

  return reciters;
};
