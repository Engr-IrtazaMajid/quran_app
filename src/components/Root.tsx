import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';
import { AudioPlayer } from './AudioPlayer';
import { SurahList } from './SurahList';
import { AyahList } from './AyahList';
import { useEffect } from 'react';
import { useQuranStore } from '../store/quranStore';
import { NavBar } from './NavBar';
import { NotFound } from './NotFound';
import { PrayerTimesPage } from './PrayerTimesPage';

const queryClient = new QueryClient();

export const Root = () => {
  const { isDarkMode, loadStoredState } = useQuranStore();

  useEffect(() => {
    loadStoredState();
  }, [loadStoredState]);

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
          <NavBar />
          <main className='container mx-auto px-4 py-8 mb-24 mt-12 md:mt-0'>
            <Routes>
              <Route path='/' element={<SurahList />} />
              <Route path='/surah/:number' element={<AyahList />} />
              <Route path='/prayer-times' element={<PrayerTimesPage />} />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </main>
          <AudioPlayer />
        </div>
      </div>
    </QueryClientProvider>
  );
};

export default Root;
