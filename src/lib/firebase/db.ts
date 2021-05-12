import { db } from './config';
import { Favorite } from '../store/types';

export const deleteFavorite = (uid: string, verseTitle: string) => {
  return db
    .collection('users')
    .doc(uid)
    .collection('favorites')
    .doc(verseTitle)
    .delete();
};

export const addFavorite = (
  uid: string,
  verseTitle: string,
  favorite: Favorite
) => {
  return db
    .collection('users')
    .doc(uid)
    .collection('favorites')
    .doc(verseTitle)
    .set(favorite, { merge: true });
};
