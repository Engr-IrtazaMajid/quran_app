import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SurahList } from './SurahList';
import { AyahList } from './AyahList';
import { NotFound } from './NotFound';
import { Layout } from './Layout';
import { BookmarksList } from './BookmarksList';
import { PrayerTimesPage } from './PrayerTimesPage';

export const Root = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<SurahList />} />
          <Route path='/surah/:number' element={<AyahList />} />
          <Route path='/bookmarks' element={<BookmarksList />} />
          <Route path='/prayer-times' element={<PrayerTimesPage />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
