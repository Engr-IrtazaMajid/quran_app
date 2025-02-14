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
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Surah } from '../types/quran';

interface NavigationButtonProps {
  direction: 'previous' | 'next';
  surah: Surah | null;
  className?: string;
}

const NavigationButton: React.FC<NavigationButtonProps> = ({
  direction,
  surah,
  className,
}) => {
  if (!surah) {
    return <div className={`w-6 md:w-24 ${className}`} />;
  }

  const Icon = direction === 'previous' ? StepBack : StepForward;
  const label = direction === 'previous' ? 'Previous' : 'Next';

  return (
    <Link
      to={`/surah/${surah.number}`}
      className={`flex items-center space-x-2 text-gray-500 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-all duration-200 hover:scale-105 ${className}`}
    >
      {direction === 'previous' && <Icon className='w-4 h-4 md:w-5 md:h-5' />}
      <div className='hidden md:flex items-center space-x-1'>
        <span className='text-xs opacity-75'>{label}:</span>
        <span className='text-sm font-medium'>{surah.name}</span>
      </div>
      {direction === 'next' && <Icon className='w-4 h-4 md:w-5 md:h-5' />}
    </Link>
  );
};

const PlayButton: React.FC<{
  isPlaying: boolean;
  isLoading: boolean;
  disabled: boolean;
  onClick: () => void;
}> = ({ isPlaying, isLoading, disabled, onClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className='rounded-full text-white bg-gradient-to-r from-emerald-500 to-emerald-600 
      hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 
      w-10 h-10 md:w-12 md:h-12 flex items-center justify-center shadow-lg hover:shadow-emerald-500/25
      transition-all duration-200 hover:scale-105'
  >
    {isLoading ? (
      <Loader2 className='w-4 h-4 md:w-5 md:h-5 animate-spin' />
    ) : isPlaying ? (
      <Pause className='w-4 h-4 md:w-5 md:h-5' />
    ) : (
      <Play className='w-4 h-4 md:w-5 md:h-5 ml-0.5' />
    )}
  </button>
);

const ControlButton: React.FC<{
  icon: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}> = ({ icon, onClick, disabled }) => (
  <button
    className='p-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 transition-all duration-200 hover:scale-105'
    disabled={disabled}
    onClick={onClick}
  >
    {icon}
  </button>
);

export const AudioPlayer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isAyahListView = location.pathname.includes('/surah/');

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
    <div className='fixed bottom-[52px] md:bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700 z-30 shadow-lg'>
      <div className='container mx-auto px-4'>
        <audio ref={audioRef} onEnded={handleArabicAudioEnd} />
        <audio ref={translationAudioRef} onEnded={handleTranslationAudioEnd} />

        {currentSurah && (
          <div className='py-3 sm:py-4 flex flex-col items-center'>
            {!isAyahListView && (
              <button
                onClick={navigateToCurrentAyah}
                className='text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors mb-3 group'
                dir={
                  audioSettings.selectedLanguage === 'ar' ||
                  audioSettings.selectedLanguage === 'ur'
                    ? 'rtl'
                    : 'ltr'
                }
              >
                <span className='font-medium underline group-hover:text-emerald-500 dark:group-hover:text-emerald-400'>
                  <span>{currentSurah.name}</span>
                  <span className='mx-1'>•</span>
                  <span>Verse {currentAyah?.numberInSurah}</span>
                </span>
              </button>
            )}

            {isTranslationPlaying && (
              <div className='text-xs text-emerald-500 mt-1 mb-2 animate-pulse'>
                Playing {audioSettings.selectedLanguage.toUpperCase()}
              </div>
            )}

            <div className='flex items-center justify-center md:justify-between w-full px-2 md:px-0'>
              <div className='hidden md:block'>
                <NavigationButton direction='previous' surah={previousSurah} />
              </div>

              <div className='flex items-center space-x-4 md:space-x-6'>
                <NavigationButton
                  direction='previous'
                  surah={previousSurah}
                  className='md:hidden'
                />

                <ControlButton
                  icon={
                    <SkipBack className='w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-300' />
                  }
                  onClick={handlePrevAyah}
                  disabled={isFirstAyah || isLoading}
                />

                <PlayButton
                  isPlaying={isPlaying}
                  isLoading={isLoading}
                  disabled={!currentAyah?.audio || isLoading}
                  onClick={handlePlayPause}
                />

                <ControlButton
                  icon={
                    <SkipForward className='w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-300' />
                  }
                  onClick={handleNextAyah}
                  disabled={isLastAyah || isLoading}
                />

                <NavigationButton
                  direction='next'
                  surah={nextSurah}
                  className='md:hidden'
                />
              </div>

              <div className='hidden md:block'>
                <NavigationButton direction='next' surah={nextSurah} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
