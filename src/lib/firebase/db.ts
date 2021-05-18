import firebase from 'firebase/app';
import { db } from './config';
import { Category, Favorite } from '../store/types';

export const deleteFavorite = (uid: string, favorite: Favorite) => {
  // Deleting requires two steps, first delete the favorite, then decrement
  // it's category by 1.

  // Set up the firestore batch
  const batch = db.batch();

  // First delete the Favorite
  const favoriteRef = db
    .collection('users')
    .doc(uid)
    .collection('favorites')
    .doc(favorite.verseTitle);
  batch.delete(favoriteRef);

  // Second decrement the category
  const categoryRef = db
    .collection('users')
    .doc(uid)
    .collection('categories')
    .doc(favorite.categoryId);
  batch.update(categoryRef, {
    count: firebase.firestore.FieldValue.increment(-1),
  });

  return batch.commit();
};

export const addFavorite = (
  uid: string,
  verseTitle: string,
  favorite: Favorite
) => {
  // Set up the batch
  const batch = db.batch();

  // First add the new favorite
  const favoriteRef = db
    .collection('users')
    .doc(uid)
    .collection('favorites')
    .doc(verseTitle);
  batch.set(favoriteRef, favorite, { merge: true });

  // Second, increment the category by 1
  const categoryRef = db
    .collection('users')
    .doc(uid)
    .collection('categories')
    .doc(favorite.categoryId);
  batch.update(categoryRef, {
    count: firebase.firestore.FieldValue.increment(1),
  });

  return batch.commit();
};

export const updateFavorite = async (
  uid: string,
  verseTitle: string,
  favorite: Favorite
) => {
  // Update is different from adding. When updating I need to first
  // decrement the old category, the update the favorite, then increment
  // the new category.
  const oldCategoryRef = db
    .collection('users')
    .doc(uid)
    .collection('favorites')
    .doc(verseTitle);
  const oldCategorySnapshot = await oldCategoryRef.get();
  const categoryId = oldCategorySnapshot.get('categoryId');

  // Set up the batch
  const batch = db.batch();

  // First update the favorite
  const favoriteRef = db
    .collection('users')
    .doc(uid)
    .collection('favorites')
    .doc(verseTitle);
  batch.set(favoriteRef, favorite, { merge: true });

  // Second, if the category has changed
  if (categoryId !== favorite.categoryId) {
    // Increment the new category by 1
    const newCategoryRef = db
      .collection('users')
      .doc(uid)
      .collection('categories')
      .doc(favorite.categoryId);
    batch.update(newCategoryRef, {
      count: firebase.firestore.FieldValue.increment(1),
    });
    // Decrement the old category by 1
    const oldCategoryRef = db
      .collection('users')
      .doc(uid)
      .collection('categories')
      .doc(categoryId);
    batch.update(oldCategoryRef, {
      count: firebase.firestore.FieldValue.increment(-1),
    });
  }

  return batch.commit();
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
