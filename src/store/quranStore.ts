import { create } from 'zustand';
import { Surah, Ayah, Reciter } from '../types/quran';

interface QuranStore {
  currentSurah: (Surah & { ayahs: Ayah[] }) | null;
  currentAyah: Ayah | null;
  currentSurahAyahs: Ayah[] | null;
  currentReciter: Reciter | null;
  isPlaying: boolean;
  isDarkMode: boolean;
  audioRef: HTMLAudioElement | null;
  isLoading: boolean;
  setCurrentSurah: (surah: Surah & { ayahs: Ayah[] }) => void;
  setCurrentAyah: (ayah: Ayah | null) => void;
  setCurrentSurahAyahs: (ayahs: Ayah[]) => void;
  setCurrentReciter: (reciter: Reciter) => void;
  togglePlayback: () => void;
  toggleDarkMode: () => void;
  setAudioRef: (ref: HTMLAudioElement) => void;
  setIsLoading: (loading: boolean) => void;
  preloadNextAyah: () => void;
}

export const useQuranStore = create<QuranStore>((set, get) => ({
  currentSurah: null,
  currentAyah: null,
  currentSurahAyahs: null,
  currentReciter: null,
  isPlaying: false,
  isDarkMode: false,
  audioRef: null,
  isLoading: false,
  setCurrentSurah: (surah) => set({ currentSurah: surah }),
  setCurrentAyah: (ayah) => set({ currentAyah: ayah }),
  setCurrentSurahAyahs: (ayahs) => set({ currentSurahAyahs: ayahs }),
  setCurrentReciter: (reciter) => set({ currentReciter: reciter }),
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setAudioRef: (ref) => set({ audioRef: ref }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  preloadNextAyah: () => {
    const { currentAyah, currentSurahAyahs } = get();
    // Ensure currentSurah and ayahs are properly defined
    if (!currentSurahAyahs || !currentAyah) return;

    const currentIndex = currentSurahAyahs.findIndex(
      (ayah) => ayah.number === currentAyah.number
    );

    if (currentIndex === -1 || currentIndex === currentSurahAyahs.length - 1)
      return;

    const nextAyah = currentSurahAyahs[currentIndex + 1];
    if (nextAyah?.audio) {
      const audio = new Audio();
      audio.src = nextAyah.audio;
      audio.preload = 'auto';
    }
  },
}));
