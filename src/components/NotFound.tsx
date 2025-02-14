import React from 'react';
import { Link } from 'react-router-dom';

export const NotFound: React.FC = () => {
  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='text-center'>
        <h1 className='text-4xl font-bold text-gray-900 dark:text-white mb-4'>
          404 - Page Not Found
        </h1>
        <p className='text-gray-600 dark:text-gray-300 mb-6'>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to='/'
          className='inline-flex items-center px-4 py-2 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors'
        >
          Return Home
        </Link>
      </div>
    </div>
  );
};
