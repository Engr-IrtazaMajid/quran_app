import moment from 'moment-hijri';
import { Coordinates } from '../types/prayer';

const LOCATION_ADJUSTMENTS: { [key: string]: number } = {
  SA: 0, // Saudi Arabia
  PK: 1, // Pakistan
  IN: 1, // India
  BD: 1, // Bangladesh
  // Add more countries as needed
};

// Function to get country code and city name from coordinates using reverse geocoding
async function getLocationInfo(
  coords: Coordinates
): Promise<{ countryCode: string; cityName: string }> {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`
    );
    const data = await response.json();
    return {
      countryCode: data.countryCode,
      cityName: data.city || data.locality || 'Unknown City',
    };
  } catch (error) {
    console.error('Error getting location info:', error);
    return {
      countryCode: 'PK',
      cityName: 'Lahore',
    };
  }
}

// Function to get Hijri date adjustment based on location
async function getLocationAdjustment(coords: Coordinates): Promise<number> {
  const { countryCode } = await getLocationInfo(coords);
  return LOCATION_ADJUSTMENTS[countryCode] || 0;
}

export async function getAdjustedHijriDate(
  coords: Coordinates,
  date = new Date()
) {
  const adjustment = await getLocationAdjustment(coords);
  const { cityName } = await getLocationInfo(coords);
  // Create Hijri date and add adjustment days
  const hijriDate = moment(date).add(adjustment, 'days').format('iYYYY/iM/iD');
  const momentHijri = moment(hijriDate, 'iYYYY/iM/iD');

  return {
    year: momentHijri.iYear(),
    month: momentHijri.iMonth(), // 0-based index
    day: momentHijri.iDate(),
    monthName: momentHijri.format('iMMMM'), // Hijri month name
    monthLength: momentHijri.endOf('iMonth').iDate(), // Days in month
    gregorianDate: date,
    cityName, // Add city name to the return object
  };
}

export function isRamadan(hijriDate: { month: number }): boolean {
  return hijriDate.month === 8; // Ramadan is the 9th month (0-based index)
}

export function formatGregorianDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}
