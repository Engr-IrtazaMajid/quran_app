import { useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuranStore } from '../store/quranStore';
import { useQuery } from 'react-query';
import { fetchAyahs } from '../services/api';

export const AyahList = () => {
  const { number } = useParams();
  const {
    setCurrentAyah,
    currentSurahAyahs,
    currentAyah,
    isPlaying,
    isLoading,
    currentSurah,
    setCurrentSurahAyahs,
    currentReciter,
    isDarkMode,
  } = useQuranStore();

  useQuery(
    ['ayahs', number, currentReciter?.id],
    () => fetchAyahs(Number(number), currentReciter?.id),
    {
      enabled: !!number && !!currentReciter?.id,
      onSuccess: (data) => {
        setCurrentSurahAyahs(data);
        if (!currentAyah) {
          setCurrentAyah(data[0]);
        }
      },
    }
  );

  const ayahRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (currentAyah && ayahRefs.current[currentAyah.number]) {
      ayahRefs.current[currentAyah.number]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentAyah]);

  if (!currentSurah) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='space-y-4 mt-24 md:mt-20'>
      <div className='top-20 bg-gray-50 dark:bg-gray-900 py-4 z-10'>
        <div className='text-center'>
          <h2 className='text-3xl font-arabic text-gray-900 dark:text-white mb-2'>
            {currentSurah.name}
          </h2>
          <p className='text-lg text-gray-600 dark:text-gray-300'>
            {currentSurah.englishName} - {currentSurah.englishNameTranslation}
          </p>
        </div>
      </div>

      {currentSurahAyahs?.map((ayah) => (
        <div
          key={ayah.number}
          ref={(el) => (ayahRefs.current[ayah.number] = el)}
          className={`p-6 rounded-lg shadow-md transition-all duration-500 ${
            currentAyah?.number === ayah.number
              ? `ring-2 ${
                  isDarkMode
                    ? 'ring-emerald-500 bg-emerald-700 text-white'
                    : 'ring-yellow-400 bg-yellow-50 text-yellow-700'
                } transform scale-[1.02] ${
                  isPlaying && !isLoading ? 'animate-pulse' : ''
                }`
              : 'bg-white dark:bg-gray-800 hover:shadow-lg'
          }`}
        >
          <div className='flex justify-between items-start mb-4'>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                currentAyah?.number === ayah.number
                  ? isDarkMode
                    ? 'bg-emerald-900 text-emerald-300'
                    : 'bg-yellow-300 text-yellow-700'
                  : 'bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400'
              }`}
            >
              {ayah.numberInSurah}
            </span>
            {/* <button className='text-gray-400 transition-colors hover:text-yellow-800 dark:hover:text-emerald-400'> TODO: Implement bookmark
              <Bookmark className='w-5 h-5' />
            </button> */}
          </div>
          <div className='space-y-4'>
            <p
              className={`text-2xl font-arabic text-right leading-loose cursor-pointer transition-colors duration-300 ${
                currentAyah?.number === ayah.number
                  ? isDarkMode
                    ? 'text-emerald-100'
                    : 'text-yellow-700'
                  : 'text-gray-900 dark:text-white hover:text-yellow-800 dark:hover:text-emerald-400'
              }`}
              onClick={() => setCurrentAyah(ayah)}
            >
              {ayah.text}
            </p>
            {ayah.translation && (
              <p
                className={`text-lg transition-colors duration-300 ${
                  currentAyah?.number === ayah.number
                    ? isDarkMode
                      ? 'text-emerald-300'
                      : 'text-yellow-600'
                    : 'text-gray-600 dark:text-gray-300 hover:text-yellow-800 dark:hover:text-emerald-400'
                }`}
              >
                {ayah.translation}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
