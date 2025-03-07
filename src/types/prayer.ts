export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  sehri?: string;
  iftar?: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface HijriDateInfo {
  year: number;
  month: number;
  day: number;
  monthName: string;
  monthLength: number;
  gregorianDate: Date;
  cityName?: string;
}
