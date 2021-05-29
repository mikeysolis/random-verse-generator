import firebase from 'firebase/app';

export interface Verse {
  volumeTitle: string;
  verseTitle: string;
  scriptureText: string;
  verseId: number;
}

export type Favorite = {
  verseTitle: string;
  verseId: number;
  volumeTitle: string;
  scriptureText: string;
  note?: string;
  categoryId?: string;
};

export type Category = {
  id: string;
  name: string;
  count?: number;
};

export type User = firebase.User | null | undefined;

export interface FirebaseError {
  errorMessage: string;
}
