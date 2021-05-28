import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

export const firebaseConfig = {
  apiKey: 'AIzaSyCXEG2dQ7sY-mNUCe9Ex0mLPuLAeNpGKsc',
  authDomain: 'scripture-study-apps-dev.firebaseapp.com',
  projectId: 'scripture-study-apps-dev',
  storageBucket: 'scripture-study-apps-dev.appspot.com',
  messagingSenderId: '1067468225014',
  appId: '1:1067468225014:web:9b974d2faa46776657afd7',
};

firebase.initializeApp(firebaseConfig);

// Auth exports
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();

// Firestore exports
export const firestore = firebase.firestore();
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const increment = firebase.firestore.FieldValue.increment;
