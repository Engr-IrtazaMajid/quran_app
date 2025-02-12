import React from 'react';
import { useQuery } from 'react-query';
import { useQuranStore } from '../store/quranStore';
import { fetchSurahs } from '../services/api';
import { Link } from 'react-router-dom';

export const SurahList: React.FC = () => {
  const { currentSurah } = useQuranStore();
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
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <div className='w-10 h-10 flex items-center justify-center bg-emerald-100 dark:bg-emerald-900 rounded-full'>
                <span className='text-emerald-600 dark:text-emerald-400 font-semibold'>
                  {surah.number}
                </span>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 dark:text-white'>
                  {surah.englishName}
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  {surah.englishNameTranslation}
                </p>
              </div>
            </div>
            <div className='text-right'>
              <p className='text-lg font-arabic text-gray-800 dark:text-gray-200'>
                {surah.name}
              </p>
              <p className='text-sm text-gray-500 dark:text-gray-400'>
                {surah.numberOfAyahs} verses
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
