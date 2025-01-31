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
  reciter: string = 'ar.alafasy'
): Promise<Ayah[]> => {
  const response = await api.get(`/surah/${surahNumber}/${reciter}`);
  return response.data.data.ayahs;
};

export const fetchReciters = async (): Promise<Reciter[]> => {
  const response = await api.get('/edition/format/audio');
  return response.data.data.map((reciter: any) => ({
    id: reciter.identifier,
    name: reciter.englishName,
    style: reciter.type,
  }));
};
