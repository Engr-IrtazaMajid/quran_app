import React from 'react';
import { Calendar } from 'lucide-react';

class HijriDate {
  private date: Date;
  private hijriYear: number;
  private hijriMonth: number;
  private hijriDay: number;

  constructor(date: Date = new Date()) {
    this.date = date;
    const [year, month, day] = this.gregorianToHijri(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    );
    this.hijriYear = year;
    this.hijriMonth = month - 1; // 0-based month
    this.hijriDay = day;
  }

  private gregorianToHijri(
    year: number,
    month: number,
    day: number
  ): [number, number, number] {
    const jd = this.gregorianToJulian(year, month, day);
    return this.julianToHijri(jd);
  }

  private gregorianToJulian(year: number, month: number, day: number): number {
    if (month < 3) {
      year -= 1;
      month += 12;
    }
    const a = Math.floor(year / 100);
    const b = 2 - a + Math.floor(a / 4);
    return (
      Math.floor(365.25 * (year + 4716)) +
      Math.floor(30.6001 * (month + 1)) +
      day +
      b -
      1524.5
    );
  }

  private julianToHijri(jd: number): [number, number, number] {
    jd = Math.floor(jd) + 0.5;
    const year = Math.floor((30 * (jd - 1948439.5) + 10646) / 10631);
    const month = Math.min(
      12,
      Math.ceil((jd - (29 + this.hijriToJulian(year, 1, 1))) / 29.5) + 1
    );
    const day = Math.ceil(jd - this.hijriToJulian(year, month, 1)) + 1;
    return [year, month, day];
  }

  private hijriToJulian(year: number, month: number, day: number): number {
    return (
      day +
      Math.ceil(29.5 * (month - 1)) +
      (year - 1) * 354 +
      Math.floor((3 + 11 * year) / 30) +
      1948439.5 -
      1
    );
  }

  public getYear(): number {
    return this.hijriYear;
  }

  public getMonth(): number {
    return this.hijriMonth;
  }

  public getDate(): number {
    return this.hijriDay;
  }

  public getDaysInMonth(): number {
    // Simplified calculation - alternating 30 and 29 days
    return this.hijriMonth % 2 === 0 ? 30 : 29;
  }

  public getDay(): number {
    return this.date.getDay();
  }

  static fromDate(year: number, month: number, day: number): HijriDate {
    const date = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
    return new HijriDate(date);
  }
}

export const IslamicCalendar: React.FC = () => {
  const today = new HijriDate();
  const currentMonth = today.getMonth();
  const currentDay = today.getDate();
  const currentYear = today.getYear();

  const daysInMonth = today.getDaysInMonth();
  const firstDayOfMonth = HijriDate.fromDate(currentYear, currentMonth, 1);
  const startDay = firstDayOfMonth.getDay();

  const weeks = [];
  let days = [];
  let dayCount = 1;

  for (let i = 0; i < startDay; i++) {
    days.push(<td key={`empty-${i}`} className='p-4'></td>);
  }

  while (dayCount <= daysInMonth) {
    const isToday = dayCount === currentDay;
    days.push(
      <td key={dayCount} className='p-2 text-center'>
        <span
          className={`aspect-square flex items-center justify-center rounded-lg shadow-md text-gray-900 dark:text-white
          ${
            isToday
              ? 'bg-emerald-500 text-white shadow-lg'
              : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
          }text-sm md:text-base lg:text-lg`}
        >
          {dayCount}
        </span>
      </td>
    );

    if ((startDay + dayCount) % 7 === 0) {
      weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>);
      days = [];
    }
    dayCount++;
  }

  if (days.length > 0) {
    weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>);
  }

  const monthNames = [
    'Muharram',
    'Safar',
    'Rabi al-Awwal',
    'Rabi al-Thani',
    'Jumada al-Awwal',
    'Jumada al-Thani',
    'Rajab',
    'Shaban',
    'Ramadan',
    'Shawwal',
    'Dhu al-Qadah',
    'Dhu al-Hijjah',
  ];

  return (
    <div className='bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-8 max-w-2xl'>
      <div className='flex items-center mb-6'>
        <Calendar className='w-6 h-6 text-emerald-500' />
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
          Islamic Calendar
        </h2>
      </div>

      {/* Month and Year */}
      <div className='text-center mb-6'>
        <h3 className='text-xl font-semibold text-gray-900 dark:text-white'>
          {monthNames[currentMonth]} {currentYear}
        </h3>
      </div>

      <table className='w-full table-fixed'>
        <thead>
          <tr className='bg-gradient-to-r from-gray-50 to-gray-200 dark:from-gray-700 dark:to-gray-800'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <th
                key={day}
                className='p-3 text-sm font-semibold text-gray-900 dark:text-white md:text-base lg:text-lg'
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{weeks}</tbody>
      </table>
    </div>
  );
};
