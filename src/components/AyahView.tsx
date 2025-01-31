import React from 'react';
import { Bookmark } from 'lucide-react';
import { Ayah } from '../types/quran';

interface AyahViewProps {
  ayah: Ayah;
}

export const AyahView: React.FC<AyahViewProps> = ({ ayah }) => {
  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-4'>
      <div className='flex justify-between items-start mb-4'>
        <span className='bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-sm'>
          {ayah.numberInSurah}
        </span>
        <button className='text-gray-400 hover:text-emerald-500 transition-colors'>
          <Bookmark className='w-5 h-5' />
        </button>
      </div>
      <div className='space-y-4'>
        <p className='text-2xl font-arabic text-right leading-loose text-gray-900 dark:text-white'>
          {ayah.text}
        </p>
        {ayah.translation && (
          <p className='text-gray-600 dark:text-gray-300 text-lg'>
            {ayah.translation}
          </p>
        )}
      </div>
    </div>
  );
};
