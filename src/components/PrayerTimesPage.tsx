import React from 'react';
import { PrayerTimes } from './PrayerTime';
import { IslamicCalendar } from './IslamicCalendar';

export const PrayerTimesPage: React.FC = () => {
  return (
    <div className='md:mt-24 space-y-6 max-w-7xl mx-auto px-4'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <PrayerTimes />
        <IslamicCalendar />
      </div>
    </div>
  );
};
