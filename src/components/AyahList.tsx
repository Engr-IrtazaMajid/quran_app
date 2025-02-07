import { useEffect, useRef } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useQuranStore } from '../store/quranStore';
import { useQuery } from 'react-query';
import { fetchAyahs } from '../services/api';
import { Globe2 } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

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
    audioSettings,
    toggleTranslation,
    isDarkMode,
    setTranslationLanguage,
    setDisplayLanguage,
  } = useQuranStore();

  useQuery(
    [
      'ayahs',
      number,
      currentReciter?.id,
      audioSettings.withTranslation,
      audioSettings.selectedLanguage,
    ],
    () =>
      fetchAyahs(
        Number(number),
        currentReciter?.id,
        audioSettings.withTranslation,
        audioSettings.selectedLanguage
      ),
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
      <div className='sticky top-20 bg-gray-50 dark:bg-gray-900 py-4 z-10'>
        <div className='text-center space-y-4'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-arabic text-gray-900 dark:text-white mb-2'>
            {currentSurah?.name}
          </h2>
          <div className='flex flex-row items-center justify-center gap-2 px-4'>
            <button
              onClick={toggleTranslation}
              className={`inline-flex items-center justify-center px-3 sm:px-4 py-2 rounded-full transition-all duration-300 space-x-2 shadow-sm hover:shadow-md
                ${
                  audioSettings.withTranslation
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:from-gray-200 hover:to-gray-300 dark:from-gray-700 dark:to-gray-800 dark:text-gray-200'
                }`}
            >
              <Globe2 className='w-4 h-4 sm:w-5 sm:h-5' />
              <span className='text-xs sm:text-sm font-medium'>
                {audioSettings.withTranslation ? 'Hide' : 'Show'}
              </span>
            </button>

            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden flex-1 sm:flex-none
                ${
                  audioSettings.withTranslation
                    ? 'opacity-100 max-w-[200px] sm:max-w-none'
                    : 'opacity-0 max-w-0'
                }`}
            >
              {audioSettings.withTranslation && (
                <LanguageSelector
                  onLanguageChange={(lang) => {
                    setTranslationLanguage(lang);
                    setDisplayLanguage(lang);
                  }}
                />
              )}
            </div>
          </div>
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
          </div>
          <div className='space-y-4'>
            {/* Arabic Text */}
            <p
              className={`text-lg sm:text-xl md:text-2xl font-arabic text-right leading-loose ${
                currentAyah?.number === ayah.number
                  ? isDarkMode
                    ? 'text-emerald-100'
                    : 'text-yellow-700'
                  : 'text-gray-900 dark:text-white'
              }`}
              onClick={() => setCurrentAyah(ayah)}
            >
              {ayah.text}
            </p>

            {/* Translation Text */}
            {audioSettings.withTranslation &&
              ayah.translations[audioSettings.selectedLanguage] && (
                <p
                  className={`text-sm sm:text-base md:text-lg leading-relaxed ${
                    currentAyah?.number === ayah.number
                      ? isDarkMode
                        ? 'text-emerald-300'
                        : 'text-yellow-600'
                      : 'text-gray-600 dark:text-gray-300'
                  }`}
                  dir={
                    audioSettings.selectedLanguage === 'ar' ||
                    audioSettings.selectedLanguage === 'ur'
                      ? 'rtl'
                      : 'ltr'
                  }
                >
                  {ayah.translations[audioSettings.selectedLanguage]}
                </p>
              )}
          </div>
        </div>
      ))}
    </div>
  );
};
