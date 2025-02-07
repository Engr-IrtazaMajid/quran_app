export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  translations: { [key: string]: string };
  audio?: string;
  translationAudios: { [key: string]: string };
}

export interface Reciter {
  id: string;
  name: string;
  style?: string;
  language: string;
  languageName?: string;
}

export interface AudioSettings {
  withTranslation: boolean;
  selectedLanguage: string;
  displayLanguage: string;
}

interface Language {
  code: string;
  name: string;
  nativeName: string;
  edition: string; // Add edition ID for translations
  hasAudio?: boolean; // Flag to indicate if audio is available
}

export const SUPPORTED_LANGUAGES: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    edition: 'en.sahih',
    hasAudio: true,
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    edition: 'ur.jalandhry',
    hasAudio: true,
  },
  {
    code: 'fa',
    name: 'Persian',
    nativeName: 'فارسی',
    edition: 'fa.makarem',
    hasAudio: true,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    edition: 'fr.hamidullah',
    hasAudio: true,
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    edition: 'ru.kuliev',
    hasAudio: true,
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文',
    edition: 'zh.majian',
    hasAudio: true,
  },
];

// No Audio available for the following languages but can be use for text translations only
// { code: 'uz', name: 'Uzbek', nativeName: "O'zbek", edition: 'uz.sodik', hasAudio: false },
// { code: 'es', name: 'Spanish', nativeName: 'Español', edition: 'es.cortes', hasAudio: false },
// { code: 'ha', name: 'Hausa', nativeName: 'Hausa', edition: 'ha.gumi', hasAudio: false },
// { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', edition: 'hi.farooq', hasAudio: false },
// { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia', edition: 'id.indonesian', hasAudio: false },
// { code: 'it', name: 'Italian', nativeName: 'Italiano', edition: 'it.piccardo', hasAudio: false },
// { code: 'ja', name: 'Japanese', nativeName: '日本語', hasAudio: true },
// { code: 'ko', name: 'Korean', nativeName: '한국어', edition: 'ko.korean', hasAudio: false },
// { code: 'ku', name: 'Kurdish', nativeName: 'Kurdî', edition: 'ku.asan', hasAudio: false },
// { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', edition: 'ml.abdulhameed', hasAudio: false },
// { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', edition: 'nl.keyzer', hasAudio: false },
// { code: 'no', name: 'Norwegian', nativeName: 'Norsk', edition: 'no.berg', hasAudio: false },
// { code: 'pl', name: 'Polish', nativeName: 'Polski', edition: 'pl.bielawskiego', hasAudio: false },
// { code: 'ps', name: 'Pashto', nativeName: 'پښتو', edition: 'ps.abdulwali', hasAudio: false },
// { code: 'pt', name: 'Portuguese', nativeName: 'Português', edition: 'pt.elhayek', hasAudio: false },
// { code: 'ro', name: 'Romanian', nativeName: 'Română', edition: 'ro.grigore', hasAudio: false },
// { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي', edition: 'sd.amroti', hasAudio: false },
// { code: 'so', name: 'Somali', nativeName: 'Soomaali', edition: 'so.abduh', hasAudio: false },
// { code: 'sq', name: 'Albanian', nativeName: 'Shqip', edition: 'sq.ahmeti', hasAudio: false },
// { code: 'sv', name: 'Swedish', nativeName: 'Svenska', edition: 'sv.bernstrom', hasAudio: false },
// { code: 'sw', name: 'Swahili', nativeName: 'Kiswahili', edition: 'sw.barwani', hasAudio: false },
// { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', edition: 'ta.tamil', hasAudio: false },
// { code: 'tg', name: 'Tajik', nativeName: 'Тоҷикӣ', edition: 'tg.ayati', hasAudio: false },
// { code: 'th', name: 'Thai', nativeName: 'ไทย', edition: 'th.thai', hasAudio: false },
// { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', edition: 'tr.diyanet', hasAudio: false },
// { code: 'tt', name: 'Tatar', nativeName: 'Татар', edition: 'tt.nugman', hasAudio: false },
// { code: 'ug', name: 'Uyghur', nativeName: 'ئۇيغۇرچە', edition: 'ug.saleh', hasAudio: false },
// { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', edition: 'am.sadiq', hasAudio: false },
// { code: 'az', name: 'Azerbaijani', nativeName: 'Azərbaycan', edition: 'az.mammadaliyev', hasAudio: false },
// { code: 'ber', name: 'Berber', nativeName: 'ⵜⴰⵎⴰⵣⵉⵖⵜ', edition: 'ber.mensur', hasAudio: false },
// { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', edition: 'bn.bengali', hasAudio: false },
// { code: 'cs', name: 'Czech', nativeName: 'Čeština', edition: 'cs.hrbek', hasAudio: false },
// { code: 'ce', name: 'Chechen', nativeName: 'Нохчийн', edition: 'ce.myshary', hasAudio: false },
// { code: 'de', name: 'German', nativeName: 'Deutsch', edition: 'de.aburida', hasAudio: false },
// { code: 'dv', name: 'Divehi', nativeName: 'ދިވެހި', edition: 'dv.divehi', hasAudio: false },
