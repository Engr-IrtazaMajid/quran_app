import { useEffect, useRef } from 'react';
import { useParams, Navigate, Link, useLocation } from 'react-router-dom';
import { useQuranStore } from '../store/quranStore';
import { useQuery } from 'react-query';
import { fetchAyahs, fetchSurahs } from '../services/api';
import { Globe2, Bookmark } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { Ayah } from '../types/quran';
import {
  getCacheKey,
  createTranslationsMap,
  mapAyahsWithTranslations,
} from '../utils/quranHelpers';

export const AyahList = () => {
  const { number } = useParams();
  const location = useLocation();
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
    setCurrentSurah,
    addBookmark,
    removeBookmark,
    isBookmarked,
  } = useQuranStore();

  const { data: surahs } = useQuery('surahs', fetchSurahs, {
    staleTime: Infinity,
    onSuccess: (data) => {
      if (number && !currentSurah) {
        const surah = data.find((s) => s.number === Number(number));
        if (surah) {
          setCurrentSurah({ ...surah, ayahs: [] });
        }
      }
    },
  });

  useEffect(() => {
    if (number && surahs) {
      const surah = surahs.find((s) => s.number === Number(number));
      if (surah) {
        setCurrentSurah({ ...surah, ayahs: [] });
      }
    }
  }, [number, setCurrentSurah, surahs]);

  const reciterId = currentReciter?.id || 'ar.alafasy';

  const translationsCache = useRef<{
    [key: string]: {
      ayahs: Ayah[];
      translations: { [key: number]: string };
      reciterId: string;
    };
  }>({});

  const { isLoading: isAyahsLoading } = useQuery(
    [
      'ayahs',
      number,
      reciterId,
      audioSettings.withTranslation,
      audioSettings.selectedLanguage,
    ],
    async () => {
      const cacheKey = getCacheKey(number!, audioSettings.selectedLanguage);
      const cachedData = translationsCache.current[cacheKey];

      if (cachedData && cachedData.reciterId === reciterId) {
        return mapAyahsWithTranslations(
          cachedData.ayahs,
          cachedData.translations,
          audioSettings.selectedLanguage,
          audioSettings.withTranslation
        );
      }

      const ayahs = await fetchAyahs(
        Number(number),
        reciterId,
        audioSettings.withTranslation,
        audioSettings.selectedLanguage
      );

      translationsCache.current[cacheKey] = {
        ayahs,
        reciterId,
        translations: createTranslationsMap(
          ayahs,
          audioSettings.selectedLanguage
        ),
      };

      return ayahs;
    },
    {
      enabled: !!number,
      onSuccess: (data) => {
        setCurrentSurahAyahs(data);

        // Handle navigation state
        const state = location.state as {
          preserveAyah?: boolean;
          ayahNumber?: number;
        };

        if (state?.preserveAyah && state.ayahNumber) {
          const targetAyah = data.find(
            (a) => a.numberInSurah === state.ayahNumber
          );
          if (targetAyah) {
            setCurrentAyah(targetAyah);
            // Clear the state to prevent persisting across navigation
            window.history.replaceState({}, '');
            return;
          }
        }

        // If no state or target ayah not found, use current or first ayah
        if (!currentAyah || currentAyah.surahNumber !== Number(number)) {
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

  const handleAyahClick = (ayah: Ayah) => {
    if (currentAyah?.number !== ayah.number || !isPlaying) {
      setCurrentAyah(ayah);
    }
  };

  const handleBookmarkToggle = (ayah: Ayah) => {
    if (isBookmarked(ayah)) {
      removeBookmark(ayah);
    } else {
      addBookmark(ayah);
    }
  };

  // Simplified toggle handler
  const handleTranslationToggle = () => {
    toggleTranslation();
  };

  if (isAyahsLoading || !currentSurahAyahs) {
    return (
      <div className='mt-28 sm:mt-24 flex justify-center items-center min-h-[50vh]'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500' />
      </div>
    );
  }

  if (!currentSurah || currentSurahAyahs.length === 0) {
    return (
      <div className='sm:mt-24 flex justify-center items-center min-h-[50vh]'>
        <div className='text-center text-gray-600 dark:text-gray-400'>
          <p className='text-lg'>No ayahs found</p>
          <Link
            to='/'
            className='text-emerald-500 hover:text-emerald-600 mt-2 inline-block'
          >
            Return to Surah list
          </Link>
        </div>
      </div>
    );
  }

  if (!currentSurah) {
    return <Navigate to='/' replace />;
  }

  return (
    <div className='space-y-4 md:mt-18 pb-4'>
      <div className='sticky top-[4.0rem] bg-gray-50 dark:bg-gray-900 pt-10 pb-6 z-10'>
        <div className='text-center space-y-4'>
          <h2 className='text-xl sm:text-2xl md:text-3xl font-arabic text-gray-900 dark:text-white mb-2'>
            {currentSurah?.name}
          </h2>
          <div className='flex flex-row items-center justify-center gap-2 px-4'>
            <button
              onClick={handleTranslationToggle}
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
            <button
              onClick={() => handleBookmarkToggle(ayah)}
              className={`transition-colors ${
                isBookmarked(ayah)
                  ? isDarkMode
                    ? 'text-emerald-500 hover:text-emerald-600 fill-current'
                    : 'text-yellow-500 hover:text-yellow-600 fill-current'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-emerald-500'
                  : 'text-gray-400 hover:text-yellow-500'
              }`}
            >
              <Bookmark
                className='w-5 h-5'
                fill={isBookmarked(ayah) ? 'currentColor' : 'none'}
              />
            </button>
          </div>
          <div className='space-y-4'>
            <p
              className={`text-lg sm:text-xl md:text-2xl font-arabic text-right leading-loose ${
                currentAyah?.number === ayah.number
                  ? isDarkMode
                    ? 'text-emerald-100'
                    : 'text-yellow-700'
                  : 'text-gray-900 dark:text-white'
              }`}
              onClick={() => handleAyahClick(ayah)}
            >
              {ayah.text}
            </p>

            {audioSettings.withTranslation &&
              ayah.translations &&
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
