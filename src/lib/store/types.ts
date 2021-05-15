export interface Verse {
  volumeTitle: string;
  verseTitle: string;
  scriptureText: string;
  verseId: number;
}

export type Favorite = {
  verseTitle?: string;
  verseId?: number;
  volumeTitle?: string;
  scriptureText?: string;
  note?: string;
  categoryId?: string;
};

export type Category = {
  id?: string;
  name?: string;
  count?: number;
};

export interface FirebaseError {
  errorMessage: string;
}
