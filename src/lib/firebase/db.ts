import firebase from 'firebase/app';
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

export const deleteCategory = async (uid: string, id: string) => {
  // Need to delete the category but also update the users favorites by
  // setting the category to uncategorized.

  // Setup the batch
  const batch = db.batch();

  // Add the category deletion to the batch
  const categoryRef = db
    .collection('users')
    .doc(uid)
    .collection('categories')
    .doc(id);

  batch.delete(categoryRef);

  // Grab a reference to all favorites with the category being deleted.
  // Then add the results to be updated with the batch.
  const favoritesRef = db.collection('users').doc(uid).collection('favorites');
  const favoritesSnapshop = await favoritesRef
    .where('categoryId', '==', id)
    .get();

  if (!favoritesSnapshop.empty) {
    // Set up a doc ref for the uncategorized Doc, we'll need it to
    // increment it's count by one for each favorite.
    const uncategorizedRef = db
      .collection('users')
      .doc(uid)
      .collection('categories')
      .doc('uncategorized');

    favoritesSnapshop.forEach(doc => {
      batch.update(doc.ref, { categoryId: 'uncategorized' });
    });

    batch.update(uncategorizedRef, {
      count: firebase.firestore.FieldValue.increment(favoritesSnapshop.size),
    });
  }

  return batch.commit();
};

export const loadCategories = (uid: string) => {
  return db.collection('users').doc(uid).collection('categories').get();
};
