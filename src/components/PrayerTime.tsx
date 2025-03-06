import React, { useEffect, useState } from 'react';
import {
  Clock,
  SunriseIcon,
  SunsetIcon,
  MoonStarIcon,
  SunIcon,
  SunMoonIcon,
  Coffee,
  UtensilsCrossed,
  Timer,
} from 'lucide-react';
import { usePrayerStore } from '../store/prayerStore';
import { fetchPrayerTimes } from '../services/prayerApi';

const prayerIcons: { [key: string]: JSX.Element } = {
  fajr: <SunriseIcon className='w-5 h-5 text-blue-500' />,
  sunrise: <SunriseIcon className='w-5 h-5 text-yellow-500' />,
  dhuhr: <SunIcon className='w-5 h-5 text-orange-500' />,
  asr: <SunsetIcon className='w-5 h-5 text-amber-500' />,
  maghrib: <SunMoonIcon className='w-5 h-5 text-blue-500' />,
  isha: <MoonStarIcon className='w-5 h-5 text-blue-500' />,
  sehri: <Coffee className='w-5 h-5 text-yellow-500' />,
  iftar: <UtensilsCrossed className='w-5 h-5 text-green-500' />,
};

const getTimeInMinutes = (timeStr: string): number => {
  const [time, period] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

const formatTimeRemaining = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

const getNextPrayer = (prayerTimes: any): [string, string, number] => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = Object.entries(prayerTimes)
    .filter(([name]) => !['sunrise', 'sehri', 'iftar'].includes(name))
    .map(([name, time]) => ({
      name,
      time: time as string,
      minutes: getTimeInMinutes(time as string),
    }))
    .sort((a, b) => a.minutes - b.minutes);

  const nextPrayer = prayers.find((prayer) => prayer.minutes > currentMinutes);

  if (nextPrayer) {
    const timeRemaining = nextPrayer.minutes - currentMinutes;
    return [nextPrayer.name, nextPrayer.time, timeRemaining];
  }

  // If no next prayer today, return first prayer of next day
  const firstPrayer = prayers[0];
  const timeRemaining = firstPrayer.minutes + (24 * 60 - currentMinutes);
  return [firstPrayer.name, firstPrayer.time, timeRemaining];
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

  const [nextPrayerInfo, setNextPrayerInfo] = useState<
    [string, string, number]
  >(['', '', 0]);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  // Default location (Mecca, Saudi Arabia) in case of geolocation failure
  const fallbackCoordinates = { latitude: 21.3891, longitude: 39.8579 };

  useEffect(() => {
    if (prayerTimes) {
      const updateNextPrayer = () => {
        const info = getNextPrayer(prayerTimes);
        setNextPrayerInfo(info);
        setTimeRemaining(info[2]);
      };

      updateNextPrayer();
      const interval = setInterval(updateNextPrayer, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [prayerTimes]);

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
  }, [coordinates, setPrayerTimes, setIsLoading, setCoordinates]);

  if (error) {
    return (
      <div className='bg-red-50 dark:bg-red-900/50 p-4 rounded-lg'>
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

  const isRamadan = true; // You can implement actual Ramadan detection logic

  return (
    <div className='max-w-7xl mx-auto bg-white/95 dark:bg-gray-800/95 rounded-2xl md:rounded-3xl shadow-xl p-4 md:p-8 backdrop-blur-lg border border-gray-100 dark:border-gray-700'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-0 mb-6 md:mb-8'>
        <div className='flex items-center gap-3'>
          <div className='p-2.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl'>
            <Clock className='w-5 h-5 md:w-6 md:h-6 text-emerald-500' />
          </div>
          <h2 className='text-xl md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent'>
            Prayer Times
          </h2>
        </div>
        {nextPrayerInfo[0] && (
          <div className='flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 md:px-6 py-2.5 rounded-full shadow-lg shadow-emerald-500/20 text-center whitespace-nowrap'>
            <Timer className='w-4 h-4 text-white' />
            <span className='text-xs md:text-sm font-medium text-white'>
              {formatTimeRemaining(timeRemaining)} until {nextPrayerInfo[0]}
            </span>
          </div>
        )}
      </div>

      {prayerTimes && (
        <>
          {isRamadan && (
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8'>
              <div className='bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-700 rounded-xl md:rounded-2xl p-5 md:p-6 text-white shadow-xl hover:shadow-yellow-500/30 transition-all duration-300 transform hover:-translate-y-1'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='p-2.5 bg-white/20 rounded-xl'>
                    <Coffee className='w-5 h-5' />
                  </div>
                  <span className='font-semibold text-lg'>Sehri</span>
                </div>
                <div className='text-2xl md:text-3xl font-bold mb-2'>
                  {prayerTimes.sehri}
                </div>
                <div className='text-sm text-yellow-100 opacity-90'>
                  End of Sehri time
                </div>
              </div>
              <div className='bg-gradient-to-br from-green-500 via-green-600 to-green-700 rounded-xl md:rounded-2xl p-5 md:p-6 text-white shadow-xl hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1'>
                <div className='flex items-center gap-3 mb-3'>
                  <div className='p-2.5 bg-white/20 rounded-xl'>
                    <UtensilsCrossed className='w-5 h-5' />
                  </div>
                  <span className='font-semibold text-lg'>Iftar</span>
                </div>
                <div className='text-2xl md:text-3xl font-bold mb-2'>
                  {prayerTimes.iftar}
                </div>
                <div className='text-sm text-green-100 opacity-90'>
                  Time to break fast
                </div>
              </div>
            </div>
          )}

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6'>
            {Object.entries(prayerTimes)
              .filter((entry) => !['sehri', 'iftar'].includes(entry[0]))
              .map(([prayer, time]) => {
                const isNextPrayer = prayer.toLowerCase() === nextPrayerInfo[0];
                return (
                  <div
                    key={prayer}
                    className={`relative overflow-hidden rounded-xl md:rounded-2xl transition-all duration-300 ${
                      isNextPrayer
                        ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-xl shadow-emerald-500/30'
                        : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50'
                    } hover:shadow-lg transform hover:-translate-y-1`}
                  >
                    <div className='p-5 md:p-6 flex flex-col gap-4'>
                      <div className='flex items-center gap-3'>
                        <div
                          className={`p-2.5 rounded-xl ${
                            isNextPrayer
                              ? 'bg-white/30 backdrop-blur-sm'
                              : 'bg-gray-100 dark:bg-gray-600'
                          }`}
                        >
                          {prayerIcons[prayer.toLowerCase()] || (
                            <Clock
                              className={`w-5 h-5 ${
                                isNextPrayer
                                  ? 'text-white'
                                  : 'text-gray-600 dark:text-gray-300'
                              }`}
                            />
                          )}
                        </div>
                        <span
                          className={`text-base md:text-lg font-semibold capitalize ${
                            isNextPrayer
                              ? 'text-white'
                              : 'text-gray-900 dark:text-white'
                          }`}
                        >
                          {prayer}
                        </span>
                      </div>

                      <div className='flex items-center justify-between'>
                        <div
                          className={`text-lg md:text-xl font-bold ${
                            isNextPrayer
                              ? 'text-white'
                              : 'text-emerald-600 dark:text-emerald-400'
                          }`}
                        >
                          {time}
                        </div>
                        {isNextPrayer && (
                          <div className='flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full'>
                            <span className='text-xs font-medium text-white'>
                              Next
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {isNextPrayer && (
                      <div className='absolute top-3 right-3'>
                        <span className='flex h-3 w-3'>
                          <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75'></span>
                          <span className='relative inline-flex rounded-full h-3 w-3 bg-white'></span>
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </>
      )}
    </div>
  );
};
