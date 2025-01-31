import React, { useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Loader2 } from 'lucide-react';
import { useQuranStore } from '../store/quranStore';

export const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    isPlaying,
    currentAyah,
    currentSurah,
    currentSurahAyahs,
    togglePlayback,
    setAudioRef,
    setCurrentAyah,
    isLoading,
    setIsLoading,
    preloadNextAyah,
  } = useQuranStore();

  useEffect(() => {
    if (audioRef.current) {
      setAudioRef(audioRef.current);
    }
  }, [setAudioRef]);

  useEffect(() => {
    const loadAndPlayAudio = async () => {
      if (!audioRef.current || !currentAyah?.audio) return;

      try {
        setIsLoading(true);
        audioRef.current.src = currentAyah.audio;
        await audioRef.current.load();

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
  }, [currentAyah, isPlaying, togglePlayback, setIsLoading, preloadNextAyah]);

  const handlePlayPause = async () => {
    if (!audioRef.current || !currentAyah?.audio) return;

    try {
      if (isPlaying) {
        await audioRef.current.pause();
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

  const handleAudioEnd = () => {
    if (!currentSurahAyahs || !currentAyah) return;

    const currentIndex = currentSurahAyahs.findIndex(
      (ayah) => ayah.number === currentAyah.number
    );

    if (currentIndex === -1) return;

    const nextAyah = currentSurahAyahs[currentIndex + 1];
    if (nextAyah) {
      setCurrentAyah(nextAyah);
    } else {
      togglePlayback();
    }
  };

  const handlePrevAyah = () => {
    if (!currentSurahAyahs || !currentAyah) return;

    const currentIndex = (currentSurahAyahs || []).findIndex(
      (ayah) => ayah.number === currentAyah.number
    );

    if (currentIndex > 0) {
      setCurrentAyah(currentSurahAyahs?.[currentIndex - 1] || null);
    }
  };

  const handleNextAyah = () => {
    console.log('current surah', currentSurah);

    if (!currentSurahAyahs || !currentAyah) return;

    const currentIndex = currentSurahAyahs.findIndex(
      (ayah) => ayah.number === currentAyah.number
    );

    if (currentIndex < currentSurahAyahs.length - 1) {
      setCurrentAyah(currentSurahAyahs[currentIndex + 1]);
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
          onEnded={() => {
            console.log('Audio ended, calling handleAudioEnd');
            handleAudioEnd();
          }}
          onError={() => {
            if (isPlaying) {
              togglePlayback();
            }
          }}
        />
        <div className='flex flex-col items-center space-y-2'>
          {currentAyah && currentSurah && (
            <div className='text-sm text-gray-600 dark:text-gray-300'>
              {currentSurah.englishName} - Verse {currentAyah.numberInSurah}
            </div>
          )}
          <div className='flex items-center justify-center space-x-6'>
            <button
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50'
              disabled={isFirstAyah || isLoading}
              onClick={handlePrevAyah}
            >
              <SkipBack className='w-6 h-6' />
            </button>
            <button
              onClick={handlePlayPause}
              disabled={!currentAyah?.audio || isLoading}
              className='p-3 bg-emerald-500 hover:bg-emerald-600 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed relative'
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
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full disabled:opacity-50'
              disabled={isLastAyah || isLoading}
              onClick={handleNextAyah}
            >
              <SkipForward className='w-6 h-6' />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
