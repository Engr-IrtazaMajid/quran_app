import React from 'react';
import { useQuery } from 'react-query';
import { useQuranStore } from '../store/quranStore';
import { fetchSurahs } from '../services/api';
import { Link } from 'react-router-dom';

export const SurahList: React.FC = () => {
  const { audioSettings, currentSurah } = useQuranStore();
  const { data: surahs, isLoading } = useQuery('surahs', fetchSurahs);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500' />
      </div>
    );
  }

  return (
    <div className='mt-28 sm:mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4'>
      {surahs?.map((surah) => (
        <Link
          key={surah.number}
          to={`/surah/${surah.number}`}
          className={`p-4 rounded-lg shadow-md transition-all duration-300 ${
            currentSurah?.number === surah.number
              ? 'bg-emerald-50 dark:bg-emerald-900/30 ring-2 ring-emerald-500 dark:ring-emerald-400'
              : 'bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.02]'
          }`}
        >
          <div className='flex justify-between items-start'>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                currentSurah?.number === surah.number
                  ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
              }`}
            >
              {surah.number}
            </span>
          </div>
          <div className='mt-2'>
            <h3
              className={`text-lg font-medium ${
                currentSurah?.number === surah.number
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : 'text-gray-900 dark:text-white'
              }`}
              dir={
                audioSettings.selectedLanguage === 'ar' ||
                audioSettings.selectedLanguage === 'ur'
                  ? 'rtl'
                  : 'ltr'
              }
            >
              {surah.name}
            </h3>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              {surah.englishName}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};
