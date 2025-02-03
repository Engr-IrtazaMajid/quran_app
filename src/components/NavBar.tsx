import { Book, Moon, Sun, ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ReciterSelector } from './ReciterSelector';
import { useQuranStore } from '../store/quranStore';

export const NavBar = () => {
  const { isDarkMode, toggleDarkMode, currentSurah } = useQuranStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isRootPage = location.pathname === '/';

  return (
    <header className='bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              {!isRootPage ? (
                <button
                  onClick={() => navigate('/')}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full'
                >
                  <ArrowLeft className='w-6 h-6 text-gray-400' />
                </button>
              ) : (
                ''
              )}
              <h1 className='text-2xl font-semibold text-gray-900 dark:text-white flex items-center'>
                <Book className='w-6 h-6 text-emerald-500 mr-2 inline-block' />
                {!isRootPage && currentSurah
                  ? currentSurah.englishName
                  : 'Quran App'}
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
            {/* <div className='relative w-full md:w-auto'> // TODO: Implement search
              <input
                type='text'
                placeholder='Search...'
                className='w-full md:w-auto pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500'
              />
              <Search className='w-5 h-5 text-gray-400 absolute left-3 top-2.5' />
            </div> */}
            <ReciterSelector />
            <button
              onClick={toggleDarkMode}
              className='hidden md:block p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full'
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
  );
};
