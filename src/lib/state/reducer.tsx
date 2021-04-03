import { StateContext } from './State';
import { Verse } from './State';

export enum ActionType {
  ADD_VERSES = 'addVerses',
}

interface Payload {
  verses: Verse[];
}

export type Action = { type: ActionType.ADD_VERSES; payload: Payload };

export const reducer = (state: StateContext, action: Action) => {
  switch (action.type) {
    case ActionType.ADD_VERSES: {
      // const slicedArray = state.verses.slice(0, action.payload.sliderIndex + 1);
      const newVerses = state.verses.concat(action.payload.verses);
      return { ...state, verses: newVerses };
    }
  }
  return state;
};
