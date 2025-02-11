import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Surah } from '../types/quran';

interface SurahNavigationProps {
  currentSurah: Surah;
  previousSurah?: Surah;
  nextSurah?: Surah;
}

export const SurahNavigation: React.FC<SurahNavigationProps> = ({
  currentSurah,
  previousSurah,
  nextSurah,
}) => {
  return (
    <div className='fixed bottom-24 left-0 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'>
      <div className='container mx-auto px-4 py-3'>
        <div className='flex justify-between items-center'>
          {previousSurah ? (
            <Link
              to={`/surah/${previousSurah.number}`}
              className='flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors'
            >
              <ChevronLeft className='w-5 h-5' />
              <div className='text-right'>
                <div className='text-xs opacity-75'>Previous Surah</div>
                <div className='font-medium'>{previousSurah.englishName}</div>
              </div>
            </Link>
          ) : (
            <div /> /* Empty div for spacing */
          )}

          <div className='text-center'>
            <div className='text-sm font-medium text-emerald-600 dark:text-emerald-400'>
              Current Surah
            </div>
            <div className='text-lg font-bold text-gray-800 dark:text-gray-200'>
              {currentSurah.englishName}
            </div>
          </div>

          {nextSurah ? (
            <Link
              to={`/surah/${nextSurah.number}`}
              className='flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors'
            >
              <div className='text-left'>
                <div className='text-xs opacity-75'>Next Surah</div>
                <div className='font-medium'>{nextSurah.englishName}</div>
              </div>
              <ChevronRight className='w-5 h-5' />
            </Link>
          ) : (
            <div /> /* Empty div for spacing */
          )}
        </div>
      </div>
    </div>
  );
};
