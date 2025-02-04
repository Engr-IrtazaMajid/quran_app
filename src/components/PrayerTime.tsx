import React, { useEffect } from 'react';
import {
  Clock,
  SunriseIcon,
  SunsetIcon,
  MoonStarIcon,
  SunIcon,
  SunMoonIcon,
} from 'lucide-react';
import { usePrayerStore } from '../store/prayerStore';
import { fetchPrayerTimes } from '../services/prayerApi';

const prayerIcons: { [key: string]: JSX.Element } = {
  fajr: <SunriseIcon className='w-5 h-5 text-blue-400' />,
  sunrise: <SunriseIcon className='w-5 h-5 text-yellow-500' />,
  dhuhr: <SunIcon className='w-5 h-5 text-orange-400' />,
  asr: <SunsetIcon className='w-5 h-5 text-amber-500' />,
  maghrib: <SunMoonIcon className='w-5 h-5  text-blue-400' />,
  isha: <MoonStarIcon className='w-5 h-5 text-blue-500' />,
};
export const PrayerTimes: React.FC = () => {
  const {
    coordinates,
    prayerTimes,
    isLoading,
    error,
    setPrayerTimes,
    setIsLoading,
    setError,
    setCoordinates,
  } = usePrayerStore();

  // Default location (Lahore, Pakistan) in case of geolocation failure
  const fallbackCoordinates = { latitude: 31.582045, longitude: 74.329376 };

  useEffect(() => {
    const getLocation = async () => {
      if (navigator.geolocation) {
        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setCoordinates(coords);
            try {
              const times = await fetchPrayerTimes(coords);
              setPrayerTimes(times);
              setError(null);
            } catch (err) {
              setError(`Failed to fetch prayer times: ${(err as any).message}`);
            } finally {
              setIsLoading(false);
            }
          },
          async () => {
            console.log('Location access denied, using fallback coordinates');
            setCoordinates(fallbackCoordinates);
            try {
              const times = await fetchPrayerTimes(fallbackCoordinates);
              setPrayerTimes(times);
              setError(null);
            } catch (err) {
              setError(`Failed to fetch prayer times: ${(err as any).message}`);
            } finally {
              setIsLoading(false);
            }
          }
        );
      } else {
        // setError('Geolocation is not supported');
        try {
          setCoordinates(fallbackCoordinates);
          const times = await fetchPrayerTimes(fallbackCoordinates);
          setPrayerTimes(times);
          setError(null);
        } catch (err) {
          setError(`Failed to fetch prayer times: ${(err as any).message}`);
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (!coordinates) {
      getLocation();
    }
  }, [coordinates, setPrayerTimes, setIsLoading, setError, setCoordinates]);

  if (error) {
    return (
      <div className='bg-red-50 dark:bg-red-900 p-4 rounded-lg'>
        <p className='text-red-600 dark:text-red-200'>{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500' />
      </div>
    );
  }

  return (
    <div className='bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-8 max-w-2xl'>
      <div className='flex items-center gap-3 mb-6'>
        <Clock className='w-6 h-6 text-emerald-500' />
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Prayer Times
        </h2>
      </div>
      {prayerTimes && (
        <div className='grid grid-cols-2 md:grid-cols-3 gap-5'>
          {Object.entries(prayerTimes).map(([prayer, time]) => (
            <div
              key={prayer}
              className='bg-gradient-to-r from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800 p-5 rounded-xl shadow-md transform transition duration-200 hover:scale-105 hover:shadow-lg flex flex-col items-center'
            >
              <div className='flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white capitalize'>
                {prayerIcons[prayer.toLowerCase()] || (
                  <Clock className='w-5 h-5 text-gray-500' />
                )}
                {prayer}
              </div>
              <p className='text-emerald-600 dark:text-emerald-400 text-xl font-medium mt-2'>
                {time}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
