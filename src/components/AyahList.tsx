import { useEffect, useRef } from 'react';
import { useQuranStore } from '../store/quranStore';
import { Ayah } from '../types/quran';
import { Bookmark } from 'lucide-react';

export const AyahList = () => {
  const {
    setCurrentAyah,
    currentSurahAyahs,
    currentAyah,
    isPlaying,
    isLoading,
  } = useQuranStore();

  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (currentAyah && ayahRefs.current[currentAyah.number]) {
      ayahRefs.current[currentAyah.number]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
    console.log('currentAyah', currentAyah);
  }, [currentAyah]);

  const handleOnClick = (ayah: Ayah) => {
    setCurrentAyah(ayah);
  };

  return (
    <div className='space-y-4'>
      {currentSurahAyahs?.map((ayah) => (
        <div
          key={ayah.number}
          ref={(el) => (ayahRefs.current[ayah.number] = el)}
          className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transition-all duration-500 ${
            currentAyah?.number === ayah.number
              ? `ring-2 ring-emerald-500 transform scale-[1.02] bg-yellow-200 dark:bg-yellow-600 ${
                  isPlaying && !isLoading ? 'animate-pulse' : ''
                }`
              : ''
          }`}
        >
          <div className='flex justify-between items-start mb-4'>
            <span className='bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full text-sm'>
              {ayah.numberInSurah}
            </span>
            <button className='text-gray-400 hover:text-emerald-500 transition-colors'>
              <Bookmark className='w-5 h-5' />
            </button>
          </div>
          <div className='space-y-4'>
            <p
              className={`text-2xl font-arabic text-right leading-loose ${
                currentAyah?.number === ayah.number && isPlaying && !isLoading
                  ? 'text-emerald-600 dark:text-emerald-400 bg-yellow-200 dark:bg-yellow-600'
                  : 'text-gray-900 dark:text-white'
              }`}
              onClick={() => handleOnClick(ayah)}
            >
              {ayah.text}
            </p>
            {ayah.translation && (
              <p className='text-gray-600 dark:text-gray-300 text-lg'>
                {ayah.translation}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
