import { useNavigate } from 'react-router-dom';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] text-center'>
      <h1 className='text-6xl font-bold text-emerald-500 mb-4'>404</h1>
      <h2 className='text-2xl font-semibold text-gray-900 dark:text-white mb-4'>
        Page Not Found
      </h2>
      <p className='text-gray-600 dark:text-gray-300 mb-8'>
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => navigate('/')}
        className='px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors'
      >
        Return to Home
      </button>
    </div>
  );
};
