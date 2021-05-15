import { db } from './config';
import { Category, Favorite } from '../store/types';

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

export const loadFavorites = (uid: string) => {
  return db.collection('users').doc(uid).collection('favorites').get();
};

export const addCategory = async (uid: string, category: Category) => {
  return await db
    .collection('users')
    .doc(uid)
    .collection('categories')
    .doc(category.id)
    .set(category, { merge: true });
};

export const deleteCategory = (uid: string, id: string) => {
  return db
    .collection('users')
    .doc(uid)
    .collection('categories')
    .doc(id)
    .delete();
};

export const loadCategories = (uid: string) => {
  return db.collection('users').doc(uid).collection('categories').get();
};
