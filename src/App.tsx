import { useEffect, useState } from 'react';
import { Root } from './components/Root';
import { useQuranStore } from './store/quranStore';

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { loadStoredState } = useQuranStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadStoredState();
      } catch (error) {
        console.error('Failed to load stored state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [loadStoredState]);

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500' />
      </div>
    );
  }

  return <Root />;
};
