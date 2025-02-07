import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Loader2 } from 'lucide-react';
import { useQuranStore } from '../store/quranStore';
import { useNavigate } from 'react-router-dom';

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
    if (currentSurah && currentAyah) {
      navigate(`/surah/${currentSurah.number}`);
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
    <div className='fixed bottom-0 w-full bg-white dark:bg-gray-800 shadow-lg'>
      <div className='container mx-auto px-4 py-4'>
        <audio
          ref={audioRef}
          onEnded={handleArabicAudioEnd}
          onError={() => {
            if (isPlaying) {
              togglePlayback();
            }
          }}
        />
        <audio
          ref={translationAudioRef}
          onEnded={handleTranslationAudioEnd}
          onError={() => {
            setIsTranslationPlaying(false);
            handleNextAyah();
          }}
        />
        <div className='flex flex-col items-center space-y-2'>
          {currentAyah && currentSurah && (
            <div className='text-center'>
              <button
                onClick={navigateToCurrentAyah}
                className='text-sm text-gray-600 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors underline'
              >
                {currentSurah.englishName} - Verse {currentAyah.numberInSurah}
              </button>
              {isTranslationPlaying && (
                <p className='text-xs text-emerald-500 mt-1'>
                  Playing {audioSettings.selectedLanguage.toUpperCase()}{' '}
                  Translation
                </p>
              )}
            </div>
          )}
          <div className='flex items-center justify-center space-x-6'>
            <button
              className='p-2 hover:text-yellow-500 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50'
              disabled={isFirstAyah || isLoading}
              onClick={handlePrevAyah}
            >
              <SkipBack className='w-6 h-6 text-gray-600 dark:text-gray-300' />
            </button>
            <button
              onClick={handlePlayPause}
              disabled={!currentAyah?.audio || isLoading}
              className='p-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 rounded-full disabled:opacity-50 disabled:cursor-not-allowed relative'
            >
              {isLoading ? (
                <Loader2 className='w-8 h-8 animate-spin' />
              ) : isPlaying ? (
                <Pause className='w-8 h-8' />
              ) : (
                <Play className='w-8 h-8' />
              )}
            </button>
            <button
              className='p-2 hover:text-yellow-500 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50'
              disabled={isLastAyah || isLoading}
              onClick={handleNextAyah}
            >
              <SkipForward className='w-6 h-6 text-gray-600 dark:text-gray-300' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
