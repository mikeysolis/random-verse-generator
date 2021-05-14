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

export const addCategory = (uid: string, category: Category) => {
  return db
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
  // Setup the document ref for firebase
  const categoriesRef = db
    .collection('users')
    .doc(uid)
    .collection('categories');

  return categoriesRef.get();
};
