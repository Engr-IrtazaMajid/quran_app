import axios from 'axios';
import { PrayerTimes, Coordinates } from '../types/prayer';

const api = axios.create({
  baseURL: 'https://api.aladhan.com/v1',
});

// Helper function to convert 24-hour format to 12-hour format with AM/PM
const convertTo12HourFormat = (time: string): string => {
  const [hour, minute] = time.split(':').map(Number);
  const period = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12; // Convert 0 to 12 for 12 AM case
  return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
};

export const fetchPrayerTimes = async (
  coordinates: Coordinates
): Promise<PrayerTimes> => {
  const { latitude, longitude } = coordinates;
  const date = new Date();

  const response = await api.get(
    '/timings/' + date.toISOString().split('T')[0],
    {
      params: {
        latitude,
        longitude,
        method: 1, // University of Islamic Sciences, Karachi
        shafaq: 'abyad',
        school: 1, // Hanfi
      },
    }
  );

  const timings = response.data.data.timings;

  return {
    fajr: convertTo12HourFormat(timings.Fajr),
    sunrise: convertTo12HourFormat(timings.Sunrise),
    dhuhr: convertTo12HourFormat(timings.Dhuhr),
    asr: convertTo12HourFormat(timings.Asr),
    maghrib: convertTo12HourFormat(timings.Maghrib),
    isha: convertTo12HourFormat(timings.Isha),
  };
};
