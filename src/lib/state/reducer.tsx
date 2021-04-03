import { StateContext } from './State';
import { Verse } from './State';

export enum ActionType {
  CONCAT_VERSES = 'concatVerses',
  CLEAR_VERSES = 'clearVerses',
}

interface Payload {
  verses: Verse[];
}

export type Action =
  | { type: ActionType.CONCAT_VERSES; payload: Payload }
  | { type: ActionType.CLEAR_VERSES; payload: Payload };

export const reducer = (state: StateContext, action: Action) => {
  switch (action.type) {
    case ActionType.CONCAT_VERSES: {
      const newVerses = state.verses.concat(action.payload.verses);
      return { ...state, verses: newVerses };
    }
    case ActionType.CLEAR_VERSES: {
      return { ...state, verses: [] };
    }
  }
  return state;
};
