import { Verse } from '../store/types';

const isBookmarked = (verseId: number, bookmarks: Verse[]) => {
  const exists = bookmarks.findIndex(
    (bookmark: Verse) => bookmark.verseId === verseId
  );

  if (exists === -1) {
    return false;
  }

  return true;
};

export { isBookmarked };
