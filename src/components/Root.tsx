import { Book, Moon, Sun, Search } from 'lucide-react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AudioPlayer } from './AudioPlayer';
import { SurahList } from './SurahList';
import { AyahList } from './AyahList';
import { ReciterSelector } from './ReciterSelector';
import { useQuranStore } from '../store/quranStore';

const queryClient = new QueryClient();

export const Root = () => {
  const { isDarkMode, toggleDarkMode, currentSurah } = useQuranStore();

  return (
    <div>
      <QueryClientProvider client={queryClient}>
        <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
          <div className='bg-gray-50 dark:bg-gray-900 min-h-screen'>
            <header className='bg-white dark:bg-gray-800 shadow-md'>
              <div className='container mx-auto px-4 py-4'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center space-x-4'>
                    <Book className='w-8 h-8 text-emerald-500' />
                    <h1 className='text-2xl font-semibold text-gray-900 dark:text-white'>
                      Quran App
                    </h1>
                  </div>
                  <div className='flex items-center space-x-4'>
                    <div className='relative'>
                      <input
                        type='text'
                        placeholder='Search...'
                        className='pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500'
                      />
                      <Search className='w-5 h-5 text-gray-400 absolute left-3 top-2.5' />
                    </div>
                    <ReciterSelector />
                    <button
                      onClick={toggleDarkMode}
                      className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full'
                    >
                      {isDarkMode ? (
                        <Sun className='w-6 h-6 text-gray-400' />
                      ) : (
                        <Moon className='w-6 h-6 text-gray-400' />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className='container mx-auto px-4 py-8 mb-24'>
              {currentSurah ? (
                <>
                  <div className='mb-8 text-center'>
                    <h2 className='text-3xl font-arabic text-gray-900 dark:text-white mb-2'>
                      {currentSurah.name}
                    </h2>
                    <p className='text-lg text-gray-600 dark:text-gray-300'>
                      {currentSurah.englishName} -{' '}
                      {currentSurah.englishNameTranslation}
                    </p>
                  </div>
                  <AyahList />
                </>
              ) : (
                <SurahList />
              )}
            </main>

            <AudioPlayer />
          </div>
        </div>
      </QueryClientProvider>
    </div>
  );
};

export default Root;
