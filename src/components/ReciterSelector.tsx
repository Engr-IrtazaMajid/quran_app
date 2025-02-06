import React from 'react';
import { useQuery } from 'react-query';
import { Mic2 } from 'lucide-react';
import { fetchAyahs, fetchReciters } from '../services/api';
import { useQuranStore } from '../store/quranStore';

export const ReciterSelector: React.FC = () => {
  const {
    currentReciter,
    setCurrentReciter,
    setCurrentSurahAyahs,
    currentSurah,
    audioSettings,
  } = useQuranStore();

  const { data: reciters, isLoading } = useQuery('reciters', fetchReciters);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-4'>
        <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500' />
      </div>
    );
  }

  const arabicReciters = reciters?.filter((r) => r.language === 'ar') || [];

  const handleArabicReciterChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const reciter = arabicReciters.find((r) => r.id === e.target.value);
    if (reciter) {
      setCurrentReciter(reciter);
      const ayahs = await fetchAyahs(
        currentSurah?.number || 1,
        reciter.id,
        audioSettings.withTranslation
      );
      setCurrentSurahAyahs(ayahs);
    }
  };

  return (
    <div className='flex items-center space-x-2 w-full md:w-auto'>
      <Mic2 className='w-5 h-5 text-emerald-500 flex-shrink-0' />
      <select
        value={currentReciter?.id || ''}
        onChange={handleArabicReciterChange}
        className='form-select block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white'
      >
        <option value=''>Select Reciter</option>
        {arabicReciters.map((reciter) => (
          <option key={reciter.id} value={reciter.id}>
            {reciter.name}
          </option>
        ))}
      </select>
    </div>
  );
};
