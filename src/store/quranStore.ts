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
  loadStoredState: () => void;
}

const STORAGE_KEY = 'quran-app-state';

const saveState = (state: any) => {
  const stateToSave = {
    currentSurah: state.currentSurah,
    currentAyah: state.currentAyah,
    currentSurahAyahs: state.currentSurahAyahs,
    currentReciter: state.currentReciter,
    isDarkMode: state.isDarkMode,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
};

export const useQuranStore = create<QuranStore>((set, get) => ({
  currentSurah: null,
  currentAyah: null,
  currentSurahAyahs: null,
  currentReciter: null,
  isPlaying: false,
  isDarkMode: false,
  audioRef: null,
  isLoading: false,
  setCurrentSurah: (surah) => {
    set({ currentSurah: surah });
    saveState({ ...get(), currentSurah: surah });
  },
  setCurrentAyah: (ayah) => {
    set({ currentAyah: ayah });
    saveState({ ...get(), currentAyah: ayah });
  },
  setCurrentSurahAyahs: (ayahs) => {
    set({ currentSurahAyahs: ayahs });
    saveState({ ...get(), currentSurahAyahs: ayahs });
  },
  setCurrentReciter: (reciter) => {
    set({ currentReciter: reciter });
    saveState({ ...get(), currentReciter: reciter });
  },
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.isDarkMode;
      saveState({ ...get(), isDarkMode: newDarkMode });
      return { isDarkMode: newDarkMode };
    });
  },
  setAudioRef: (ref) => set({ audioRef: ref }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  preloadNextAyah: () => {
    const { currentAyah, currentSurahAyahs } = get();
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
  loadStoredState: () => {
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      set(parsedState);
    }
  },
}));
