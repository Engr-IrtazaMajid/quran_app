import React from 'react';
import { useQuranStore } from '../store/quranStore';
import { Link } from 'react-router-dom';
import { Bookmark, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export const BookmarksList: React.FC = () => {
  const { bookmarks, removeBookmark, audioSettings } = useQuranStore();

  if (bookmarks.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
        <Bookmark className='w-16 h-16 text-gray-400 mb-4' />
        <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
          No Bookmarks Yet
        </h2>
        <p className='text-gray-600 dark:text-gray-300'>
          Start bookmarking your favorite verses to see them here.
        </p>
      </div>
    );
  }

  return (
    <div className='sm:mt-24 space-y-4'>
      <div className='grid grid-cols-1 gap-4 pb-4'>
        {bookmarks.map((bookmark) => (
          <div
            key={`${bookmark.ayah.number}-${bookmark.timestamp}`}
            className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow'
          >
            <div className='flex justify-between items-start mb-4'>
              <Link
                to={`/surah/${bookmark.ayah.surahNumber}`}
                className='text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 underline'
              >
                Surah {bookmark.ayah.surahNumber} - Verse{' '}
                {bookmark.ayah.numberInSurah}
              </Link>
              <div className='flex items-center space-x-2'>
                <span className='text-sm text-gray-500 dark:text-gray-400'>
                  {format(bookmark.timestamp, 'MMM d, yyyy')}
                </span>
                <button
                  onClick={() => removeBookmark(bookmark.ayah)}
                  className='text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300'
                >
                  <Trash2 className='w-5 h-5' />
                </button>
              </div>
            </div>
            <p className='text-xl font-arabic text-right leading-loose text-gray-900 dark:text-white mb-4'>
              {bookmark.ayah.text}
            </p>
            {audioSettings.withTranslation && (
              <p
                className='text-gray-600 dark:text-gray-300'
                dir={
                  audioSettings.selectedLanguage === 'ar' ||
                  audioSettings.selectedLanguage === 'ur'
                    ? 'rtl'
                    : 'ltr'
                }
              >
                {bookmark.ayah.translations &&
                  bookmark.ayah.translations[audioSettings.selectedLanguage]}
              </p>
            )}
            {bookmark.note && (
              <div className='mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md'>
                <p className='text-sm text-gray-600 dark:text-gray-300'>
                  {bookmark.note}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
