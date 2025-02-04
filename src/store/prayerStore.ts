import { create } from 'zustand';
import { PrayerTimes, Coordinates } from '../types/prayer';

interface PrayerStore {
  coordinates: Coordinates | null;
  prayerTimes: PrayerTimes | null;
  isLoading: boolean;
  error: string | null;
  setCoordinates: (coords: Coordinates) => void;
  setPrayerTimes: (times: PrayerTimes) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const usePrayerStore = create<PrayerStore>((set) => ({
  coordinates: null,
  prayerTimes: null,
  isLoading: false,
  error: null,
  setCoordinates: (coords) => set({ coordinates: coords }),
  setPrayerTimes: (times) => set({ prayerTimes: times }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
}));
