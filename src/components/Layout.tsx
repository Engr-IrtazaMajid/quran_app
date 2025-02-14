import React from 'react';
import { Outlet } from 'react-router-dom';
import { AudioPlayer } from './AudioPlayer';
import { useQuranStore } from '../store/quranStore';
import { NavBar } from './NavBar';

export const Layout: React.FC = () => {
  const { isDarkMode } = useQuranStore();

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200'>
        <NavBar />
        <main className='container mx-auto px-4 pb-36 md:pb-28 pt-24 md:py-10'>
          <Outlet />
        </main>
        <AudioPlayer />
      </div>
    </div>
  );
};
