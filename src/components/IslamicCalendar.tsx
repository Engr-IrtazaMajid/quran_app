import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { usePrayerStore } from '../store/prayerStore';
import {
  getAdjustedHijriDate,
  isRamadan,
  formatGregorianDate,
} from '../services/hijriCalendar';
import { HijriDateInfo } from '../types/prayer';

export const IslamicCalendar: React.FC = () => {
  const { coordinates } = usePrayerStore();
  const [currentDate, setCurrentDate] = useState<HijriDateInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [calendar, setCalendar] = useState<
    Array<Array<{ hijri: number; gregorian: Date } | null>>
  >([]);

  // Add function to check if a date is in the past
  const isPastDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Add function to check if a date is today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    const initializeCalendar = async () => {
      if (!coordinates) return;

      setLoading(true);
      try {
        const hijriDate = await getAdjustedHijriDate(coordinates);
        setCurrentDate(hijriDate);
        await generateCalendarDays(hijriDate);
      } catch (error) {
        console.error('Error initializing calendar:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeCalendar();
  }, [coordinates]);

  const generateCalendarDays = async (date: HijriDateInfo) => {
    const weeks: Array<Array<{ hijri: number; gregorian: Date } | null>> = [];
    let currentWeek: Array<{ hijri: number; gregorian: Date } | null> = [];

    // Add empty cells for days before the first of the month
    const firstDay = new Date(
      date.gregorianDate.getFullYear(),
      date.gregorianDate.getMonth(),
      1
    ).getDay();
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null);
    }

    // Add the days of the month
    for (let day = 1; day <= date.monthLength; day++) {
      const gregorianDate = new Date(
        date.gregorianDate.getFullYear(),
        date.gregorianDate.getMonth(),
        day
      );

      currentWeek.push({ hijri: day, gregorian: gregorianDate });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Fill the remaining days of the last week
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    setCalendar(weeks);
  };

  const navigateMonth = async (direction: 'prev' | 'next') => {
    if (!currentDate || !coordinates) return;

    const newDate = new Date(currentDate.gregorianDate);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));

    const newHijriDate = await getAdjustedHijriDate(coordinates, newDate);
    setCurrentDate(newHijriDate);
    await generateCalendarDays(newHijriDate);
  };

  if (loading || !currentDate) {
    return (
      <div className='flex items-center justify-center p-8'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500' />
      </div>
    );
  }

  const isCurrentMonth = isRamadan(currentDate);

  return (
    <div className='bg-white/95 dark:bg-gray-800/95 rounded-xl md:rounded-2xl shadow-xl p-2.5 md:p-8 backdrop-blur-lg border border-gray-100 dark:border-gray-700'>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-0 mb-3 md:mb-8'>
        <div className='flex flex-col gap-1'>
          <div className='flex items-center gap-2'>
            <div className='p-1.5 md:p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg md:rounded-xl'>
              <Calendar className='w-4 h-4 md:w-5 md:h-5 text-emerald-500' />
            </div>
            <h2 className='text-base md:text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent'>
              Islamic Calendar
            </h2>
          </div>
          {currentDate?.cityName && (
            <span className='text-xs md:text-sm text-gray-600 dark:text-gray-400 ml-8'>
              {currentDate.cityName}
            </span>
          )}
        </div>
        <div className='flex items-center gap-1'>
          <button
            onClick={() => navigateMonth('prev')}
            className='p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300'
          >
            <ChevronLeft className='w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-300' />
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className='p-1.5 md:p-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg transition-all duration-300'
          >
            <ChevronRight className='w-4 h-4 md:w-5 md:h-5 text-gray-600 dark:text-gray-300' />
          </button>
        </div>
      </div>

      <div className='text-center mb-3 md:mb-8'>
        <h3 className='text-base md:text-2xl font-semibold text-gray-900 dark:text-white mb-1'>
          {currentDate.monthName} {currentDate.year}
        </h3>
        <p className='text-xs md:text-base text-gray-600 dark:text-gray-300'>
          {formatGregorianDate(currentDate.gregorianDate)}
        </p>
      </div>

      <div className='overflow-x-auto -mx-2.5 md:mx-0'>
        <div className='grid grid-cols-2 sm:grid-cols-7 gap-1 md:gap-2'>
          {/* Header */}
          <div className='col-span-2 sm:col-span-7 flex justify-between mb-1 md:mb-2'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className='p-1 md:p-3 text-[10px] md:text-sm font-semibold text-gray-600 dark:text-gray-300 text-center flex-1'
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          {calendar.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className='col-span-1 sm:col-span-1 text-center relative'
                >
                  {day && (
                    <div
                      className={`
                        relative group cursor-pointer transition-all duration-300
                        ${
                          isToday(day.gregorian)
                            ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/30'
                            : isCurrentMonth
                            ? isPastDate(day.gregorian)
                              ? 'bg-gray-100 dark:bg-gray-800/50 opacity-50'
                              : 'bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                            : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-600/50'
                        }
                        rounded-lg md:rounded-xl shadow-sm hover:shadow-md transform hover:-translate-y-0.5
                      `}
                    >
                      <div className='p-1 md:p-3 relative'>
                        {isToday(day.gregorian) && (
                          <div className='absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1'>
                            <span className='relative flex h-1.5 w-1.5 md:h-2 md:w-2'>
                              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 dark:bg-white opacity-75'></span>
                              <span className='relative inline-flex rounded-full h-1.5 w-1.5 md:h-2 md:w-2 bg-emerald-500 dark:bg-white'></span>
                            </span>
                          </div>
                        )}
                        <span
                          className={`
                          text-xs md:text-base lg:text-lg font-medium
                          ${
                            isToday(day.gregorian)
                              ? 'text-white'
                              : isPastDate(day.gregorian)
                              ? 'text-gray-400 dark:text-gray-500'
                              : 'text-gray-900 dark:text-white'
                          }
                        `}
                        >
                          {day.hijri}
                        </span>
                        <span
                          className={`
                          block text-[9px] md:text-xs
                          ${
                            isToday(day.gregorian)
                              ? 'text-emerald-100'
                              : isPastDate(day.gregorian)
                              ? 'text-gray-400 dark:text-gray-500'
                              : 'text-gray-500 dark:text-gray-400'
                          }
                        `}
                        >
                          {day.gregorian.toLocaleDateString('en-US', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
