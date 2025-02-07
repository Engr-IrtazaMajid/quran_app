import { create } from 'zustand';
import { Surah, Ayah, Reciter, AudioSettings } from '../types/quran';

interface QuranStore {
  currentSurah: (Surah & { ayahs: Ayah[] }) | null;
  currentAyah: Ayah | null;
  currentSurahAyahs: Ayah[] | null;
  currentReciter: Reciter | null;
  translationReciters: { [key: string]: Reciter };
  audioSettings: AudioSettings;
  isPlaying: boolean;
  isDarkMode: boolean;
  audioRef: HTMLAudioElement | null;
  translationAudioRef: HTMLAudioElement | null;
  isLoading: boolean;
  setCurrentSurah: (surah: Surah & { ayahs: Ayah[] }) => void;
  setCurrentAyah: (ayah: Ayah | null) => void;
  setCurrentSurahAyahs: (ayahs: Ayah[]) => void;
  setCurrentReciter: (reciter: Reciter) => void;
  setTranslationReciter: (language: string, reciter: Reciter) => void;
  togglePlayback: () => void;
  toggleDarkMode: () => void;
  setAudioRef: (ref: HTMLAudioElement) => void;
  setTranslationAudioRef: (ref: HTMLAudioElement) => void;
  setIsLoading: (loading: boolean) => void;
  toggleTranslation: () => void;
  setTranslationLanguage: (language: string) => void;
  preloadNextAyah: () => void;
  loadStoredState: () => void;
  setDisplayLanguage: (language: string) => void;
}

const STORAGE_KEY = 'quran-app-state';

const saveState = (state: QuranStore) => {
  const stateToSave = {
    currentSurah: state.currentSurah,
    currentAyah: state.currentAyah,
    currentSurahAyahs: state.currentSurahAyahs,
    currentReciter: state.currentReciter,
    translationReciters: state.translationReciters,
    audioSettings: {
      withTranslation: state.audioSettings.withTranslation,
      selectedLanguage: state.audioSettings.selectedLanguage,
      displayLanguage: state.audioSettings.displayLanguage,
    },
    isDarkMode: state.isDarkMode,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
};

export const useQuranStore = create<QuranStore>((set, get) => ({
  currentSurah: null,
  currentAyah: null,
  currentSurahAyahs: null,
  currentReciter: null,
  translationReciters: {},
  audioSettings: {
    withTranslation: false,
    selectedLanguage: 'en',
    displayLanguage: 'en',
  },
  isPlaying: false,
  isDarkMode: false,
  audioRef: null,
  translationAudioRef: null,
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
  setTranslationReciter: (language, reciter) => {
    set((state) => ({
      translationReciters: {
        ...state.translationReciters,
        [language]: reciter,
      },
    }));
    saveState({
      ...get(),
      translationReciters: {
        ...get().translationReciters,
        [language]: reciter,
      },
    });
  },
  togglePlayback: () => set((state) => ({ isPlaying: !state.isPlaying })),
  toggleDarkMode: () => {
    set((state) => {
      const newDarkMode = !state.isDarkMode;
      saveState({ ...get(), isDarkMode: newDarkMode });
      return { isDarkMode: newDarkMode };
    });
  },
  toggleTranslation: () => {
    set((state) => {
      const newSettings = {
        ...state.audioSettings,
        withTranslation: !state.audioSettings.withTranslation,
      };
      saveState({ ...get(), audioSettings: newSettings });
      return { audioSettings: newSettings };
    });
  },
  setTranslationLanguage: (language: string) => {
    set((state) => ({
      audioSettings: {
        ...state.audioSettings,
        selectedLanguage: language,
        displayLanguage: language,
      },
    }));
    saveState(get());
  },
  setAudioRef: (ref) => set({ audioRef: ref }),
  setTranslationAudioRef: (ref) => set({ translationAudioRef: ref }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  preloadNextAyah: () => {
    const { currentAyah, currentSurahAyahs, audioSettings } = get();
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

      if (
        audioSettings.withTranslation &&
        nextAyah.translationAudios[audioSettings.selectedLanguage]
      ) {
        const translationAudio = new Audio();
        translationAudio.src =
          nextAyah.translationAudios[audioSettings.selectedLanguage];
        translationAudio.preload = 'auto';
      }
    }
  },
  loadStoredState: () => {
    const storedState = localStorage.getItem(STORAGE_KEY);
    if (storedState) {
      const parsedState = JSON.parse(storedState);
      set({
        ...parsedState,
        audioSettings: {
          ...parsedState.audioSettings,
          selectedLanguage: parsedState.audioSettings?.selectedLanguage || 'en',
        },
      });
    }
  },
  setDisplayLanguage: (language: string) => {
    set((state) => ({
      audioSettings: {
        ...state.audioSettings,
        displayLanguage: language,
      },
    }));
    saveState(get());
  },
}));
