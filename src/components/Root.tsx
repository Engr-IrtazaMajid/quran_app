import { QueryClient, QueryClientProvider } from 'react-query';
import { Routes, Route } from 'react-router-dom';
import { AudioPlayer } from './AudioPlayer';
import { SurahList } from './SurahList';
import { AyahList } from './AyahList';

import { useQuranStore } from '../store/quranStore';
import { NavBar } from './NavBar';
import { NotFound } from './NotFound';

const queryClient = new QueryClient();

export const Root = () => {
  const { isDarkMode } = useQuranStore();

  return (
    <QueryClientProvider client={queryClient}>
      <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
          <NavBar />
          <main className='container mx-auto px-4 py-8 mb-24'>
            <Routes>
              <Route path='/' element={<SurahList />} />
              <Route path='/surah/:number' element={<AyahList />} />
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
