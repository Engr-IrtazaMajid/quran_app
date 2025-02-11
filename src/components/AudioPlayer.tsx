import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Loader2,
  StepBack,
  StepForward,
} from 'lucide-react';
import { useQuranStore } from '../store/quranStore';
import { useNavigate, Link } from 'react-router-dom';

export const AudioPlayer: React.FC = () => {
  const navigate = useNavigate();
  const audioRef = useRef<HTMLAudioElement>(null);
  const translationAudioRef = useRef<HTMLAudioElement>(null);
  const [isTranslationPlaying, setIsTranslationPlaying] = useState(false);
  const {
    isPlaying,
    currentAyah,
    currentSurah,
    currentSurahAyahs,
    audioSettings,
    togglePlayback,
    setAudioRef,
    setTranslationAudioRef,
    setCurrentAyah,
    isLoading,
    setIsLoading,
    preloadNextAyah,
    previousSurah,
    nextSurah,
  } = useQuranStore();

  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
    }
    if (translationAudioRef.current) {
      setTranslationAudioRef(translationAudioRef.current);
    }
  }, [setAudioRef, setTranslationAudioRef]);

  useEffect(() => {
    const loadAndPlayAudio = async () => {
      if (!audioRef.current || !currentAyah?.audio) return;

      try {
        setIsLoading(true);
        setIsTranslationPlaying(false);
        audioRef.current.src = currentAyah.audio;
        await audioRef.current.load();

        if (
          audioSettings.withTranslation &&
          translationAudioRef.current &&
          currentAyah.translationAudios[audioSettings.selectedLanguage]
        ) {
          translationAudioRef.current.src =
            currentAyah.translationAudios[audioSettings.selectedLanguage];
          await translationAudioRef.current.load();
        }

        if (isPlaying) {
          await audioRef.current.play();
          preloadNextAyah();
        }
      } catch (error) {
        console.error('Audio loading error:', error);
        togglePlayback();
      } finally {
        setIsLoading(false);
      }
    };

    loadAndPlayAudio();
  }, [
    currentAyah,
    isPlaying,
    audioSettings.withTranslation,
    audioSettings.selectedLanguage,
    togglePlayback,
    setIsLoading,
    preloadNextAyah,
  ]);

  const handlePlayPause = async () => {
    if (!audioRef.current || !currentAyah?.audio) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
        if (translationAudioRef.current) {
          await translationAudioRef.current.pause();
        }
        setIsTranslationPlaying(false);
      } else {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          await playPromise;
          preloadNextAyah();
        }
      }
      togglePlayback();
    } catch (error) {
      console.error('Audio playback error:', error);
      if (isPlaying) {
        togglePlayback();
      }
    }
  };

  const handleArabicAudioEnd = async () => {
    if (
      audioSettings.withTranslation &&
      translationAudioRef.current &&
      currentAyah?.translationAudios[audioSettings.selectedLanguage]
    ) {
      try {
        setIsTranslationPlaying(true);
        await translationAudioRef.current.play();
      } catch (error) {
        console.error('Translation audio playback error:', error);
        setIsTranslationPlaying(false);
        handleNextAyah();
      }
    } else {
      handleNextAyah();
    }
  };

  const handleTranslationAudioEnd = () => {
    setIsTranslationPlaying(false);
    handleNextAyah();
  };

  const handleNextAyah = () => {
    if (!currentSurahAyahs || !currentAyah) return;

    const currentIndex = currentSurahAyahs.findIndex(
      (ayah) => ayah.number === currentAyah.number
    );

    if (currentIndex < currentSurahAyahs.length - 1) {
      setCurrentAyah(currentSurahAyahs[currentIndex + 1]);
    } else {
      togglePlayback();
    }
  };

  const handlePrevAyah = () => {
    if (!currentSurahAyahs || !currentAyah) return;

    const currentIndex = currentSurahAyahs.findIndex(
      (ayah) => ayah.number === currentAyah.number
    );

    if (currentIndex > 0) {
      setCurrentAyah(currentSurahAyahs[currentIndex - 1]);
    }
  };

  const navigateToCurrentAyah = () => {
    if (currentSurah) {
      const state = {
        preserveAyah: true,
        ayahNumber: currentAyah?.numberInSurah,
      };
      navigate(`/surah/${currentSurah.number}`, {
        replace: true,
        state,
      });
    }
  };

  const isFirstAyah =
    !currentSurahAyahs || !currentAyah
      ? true
      : currentSurahAyahs[0].number === currentAyah.number;

  const isLastAyah =
    !currentSurahAyahs || !currentAyah
      ? true
      : currentSurahAyahs[currentSurahAyahs.length - 1].number ===
        currentAyah.number;

  return (
    <div className='fixed bottom-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg border-t border-gray-200 dark:border-gray-800'>
      <div className='container mx-auto px-4'>
        <audio ref={audioRef} onEnded={handleArabicAudioEnd} />
        <audio ref={translationAudioRef} onEnded={handleTranslationAudioEnd} />

        {currentSurah && (
          <div className='py-2 sm:py-4 flex flex-col items-center'>
            <div className='flex items-center justify-between w-full'>
              {previousSurah ? (
                <Link
                  to={`/surah/${previousSurah.number}`}
                  className='flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors'
                >
                  <StepBack className='w-6 h-6' />
                  <div className='text-xs opacity-75'>Previous</div>
                  <div className='hidden sm:block'>
                    <div className='text-sm font-medium'>
                      {previousSurah.name}
                    </div>
                  </div>
                </Link>
              ) : (
                <div className='w-16' />
              )}

              <div className='flex flex-col items-center w-full sm:w-auto'>
                <button
                  onClick={navigateToCurrentAyah}
                  className='text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-2 underline'
                  dir={
                    audioSettings.selectedLanguage === 'ar' ||
                    audioSettings.selectedLanguage === 'ur'
                      ? 'rtl'
                      : 'ltr'
                  }
                >
                  <span className='font-medium'>{currentSurah.name}</span>
                  <span className='mx-2'>-</span>
                  <span>Verse {currentAyah?.numberInSurah}</span>
                </button>
                {isTranslationPlaying && (
                  <div className='text-xs text-emerald-500 mt-1 animate-pulse'>
                    Playing {audioSettings.selectedLanguage.toUpperCase()}
                  </div>
                )}

                <div className='flex items-center justify-center space-x-5'>
                  <button
                    className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors'
                    disabled={isFirstAyah || isLoading}
                    onClick={handlePrevAyah}
                  >
                    <SkipBack className='w-6 h-6 text-gray-600 dark:text-gray-300' />
                  </button>

                  <button
                    onClick={handlePlayPause}
                    disabled={!currentAyah?.audio || isLoading}
                    className='rounded-full text-white bg-gradient-to-r from-emerald-500 to-emerald-600 
                      hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 
                      transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg
                      w-14 h-14 sm:w-12 sm:h-12 flex items-center justify-center'
                  >
                    {isLoading ? (
                      <Loader2 className='w-6 h-6 animate-spin' />
                    ) : isPlaying ? (
                      <Pause className='w-6 h-6' />
                    ) : (
                      <Play className='w-6 h-6' />
                    )}
                  </button>

                  {/* Next Ayah */}
                  <button
                    className='p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 transition-colors'
                    disabled={isLastAyah || isLoading}
                    onClick={handleNextAyah}
                  >
                    <SkipForward className='w-6 h-6 text-gray-600 dark:text-gray-300' />
                  </button>
                </div>
              </div>

              {nextSurah ? (
                <Link
                  to={`/surah/${nextSurah.number}`}
                  className='flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors'
                >
                  <div className='text-xs opacity-75'>Next</div>
                  <div className='hidden sm:block'>
                    <div className='text-sm font-medium'>{nextSurah.name}</div>
                  </div>
                  <StepForward className='w-6 h-6' />
                </Link>
              ) : (
                <div className='w-16' />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
