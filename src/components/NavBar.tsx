import { Book, Moon, Sun, ArrowLeft, Clock } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReciterSelector } from './ReciterSelector';
import { useQuranStore } from '../store/quranStore';

export const NavBar = () => {
  const { isDarkMode, toggleDarkMode, currentSurah } = useQuranStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isRootPage = location.pathname === '/';
  const isPrayerPage = location.pathname === '/prayer-times';

  const isSurahPage = /^\/surah\/([1-9]|[1-9][0-9]|1[0-3][0-9]|14[0-4])$/.test(
    location.pathname
  );

  return (
    <header className='bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              {!isRootPage && (
                <button
                  onClick={() => navigate('/')}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full'
                >
                  <ArrowLeft className='w-6 h-6 text-gray-400' />
                </button>
              )}
              <h1 className='text-2xl font-semibold text-gray-900 dark:text-white flex items-center'>
                {isPrayerPage ? (
                  <>
                    <Clock className='w-6 h-6 text-emerald-500 mr-2 inline-block' />
                    Prayer Times
                  </>
                ) : (
                  <>
                    <Book className='w-6 h-6 text-emerald-500 mr-2 inline-block' />
                    {!isRootPage && currentSurah
                      ? currentSurah.englishName
                      : 'Quran App'}
                  </>
                )}
              </h1>
            </div>
            <button
              onClick={toggleDarkMode}
              className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full md:hidden'
            >
              {isDarkMode ? (
                <Sun className='w-6 h-6 text-gray-400' />
              ) : (
                <Moon className='w-6 h-6 text-gray-400' />
              )}
            </button>
          </div>
          <div className='flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4'>
            {!isPrayerPage && <ReciterSelector />}
            {!isSurahPage && (
              <button
                onClick={() => navigate(isPrayerPage ? '/' : '/prayer-times')}
                className='px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 rounded-full hover:bg-emerald-600 transition-colors flex items-center justify-center'
              >
                {isPrayerPage ? (
                  <>
                    <Book className='w-5 h-5 mr-2' />
                    Back to Quran
                  </>
                ) : (
                  <>
                    <Clock className='w-5 h-5 mr-2' />
                    Prayer Times
                  </>
                )}
              </button>
            )}
            <button
              onClick={toggleDarkMode}
              className='hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full'
            >
              {isDarkMode ? (
                <Sun className='w-6 h-6 text-yellow-500' />
              ) : (
                <Moon className='w-6 h-6 text-gray-400' />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
