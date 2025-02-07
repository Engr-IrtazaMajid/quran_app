import React from 'react';
import { useQuranStore } from '../store/quranStore';
import { SUPPORTED_LANGUAGES } from '../types/quran';

interface LanguageSelectorProps {
  onLanguageChange: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
}) => {
  const { audioSettings } = useQuranStore();

  const languageOptions = SUPPORTED_LANGUAGES.map((language) => ({
    value: language.code,
    label: `${language.name.padEnd(10, '.')} ${language.nativeName}`,
  }));

  return (
    <div className='flex items-center space-x-1 sm:space-x-2 w-full'>
      <label className='text-xs sm:text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap hidden sm:inline'>
        Translation:
      </label>
      <select
        value={audioSettings.selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        className='form-select w-full text-xs sm:text-sm py-2 pl-2 pr-6 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-emerald-500 dark:hover:border-emerald-400 focus:outline-none shadow-sm'
      >
        {languageOptions.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};
