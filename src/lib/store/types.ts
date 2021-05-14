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
};

export type Category = {
  id?: string;
  displayName?: string;
  count?: number;
};
