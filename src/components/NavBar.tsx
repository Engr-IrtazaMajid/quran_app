import {
  Book,
  Moon,
  Sun,
  ArrowLeft,
  Clock,
  Bookmark,
  Home,
} from 'lucide-react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ReciterSelector } from './ReciterSelector';
import { useQuranStore } from '../store/quranStore';

export const NavBar = () => {
  const { isDarkMode, toggleDarkMode, currentSurah } = useQuranStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isRootPage = location.pathname === '/';
  const isPrayerPage = location.pathname === '/prayer-times';
  const isBookmarksPage = location.pathname === '/bookmarks';

  const navItems = [
    {
      path: '/',
      icon: <Home className='w-5 h-5' />,
      label: 'Home',
    },
    {
      path: '/bookmarks',
      icon: <Bookmark className='w-5 h-5' />,
      label: 'Bookmarks',
    },
    {
      path: '/prayer-times',
      icon: <Clock className='w-5 h-5' />,
      label: 'Prayer',
    },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className='bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50 hidden md:block'>
        <div className='container mx-auto px-4'>
          <div className='flex items-center justify-between h-20'>
            <div className='flex items-center space-x-4'>
              {!isRootPage && (
                <button
                  onClick={() => navigate(-1)}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full'
                >
                  <ArrowLeft className='w-5 h-5 text-gray-500 dark:text-gray-400' />
                </button>
              )}
              <Link to='/' className='flex items-center space-x-2'>
                <Book className='w-6 h-6 text-emerald-500' />
                <span className='text-xl font-semibold text-gray-900 dark:text-white'>
                  Quran
                </span>
              </Link>
            </div>

            <div className='flex items-center space-x-6'>
              {!isPrayerPage && !isBookmarksPage && <ReciterSelector />}
              <div className='flex items-center space-x-4'>
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-2 p-2 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? 'text-emerald-500 dark:text-emerald-400'
                        : 'text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400'
                    }`}
                  >
                    {item.icon}
                    <span className='text-sm'>{item.label}</span>
                  </Link>
                ))}
                <button
                  onClick={toggleDarkMode}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full'
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
        </div>
      </nav>

      {/* Mobile Header */}
      <header className='bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 right-0 z-50 md:hidden'>
        <div className='px-3 py-2'>
          <div className='flex items-center justify-between'>
            <h1 className='text-base font-semibold text-gray-900 dark:text-white truncate max-w-[200px]'>
              Quran
            </h1>
            {/* </div> */}
            <button
              onClick={toggleDarkMode}
              className='p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full'
            >
              {isDarkMode ? (
                <Sun className='w-4 h-4 text-yellow-500' />
              ) : (
                <Moon className='w-4 h-4 text-gray-500' />
              )}
            </button>
          </div>
          {!isPrayerPage && !isBookmarksPage && (
            <div className='mt-1 mb-2'>
              <ReciterSelector />
            </div>
          )}
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className='fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-40 md:hidden'>
        <div className='flex items-center justify-around h-14'>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-2 ${
                location.pathname === item.path
                  ? 'text-emerald-500 dark:text-emerald-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <div className='h-5 w-5 flex items-center justify-center'>
                {item.icon}
              </div>
              <span className='text-[10px] mt-0.5'>{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Add padding to main content */}
      <div className='md:pb-0' />
    </>
  );
};
