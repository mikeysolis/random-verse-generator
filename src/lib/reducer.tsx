import { StateContext } from './State';

export enum ActionType {
  SET_COUNT = 'setCount',
}

export type Action = { type: ActionType.SET_COUNT; count: number };

export const reducer = (state: StateContext, action: Action) => {
  switch (action.type) {
    case ActionType.SET_COUNT: {
      return { ...state, count: action.count };
    }
  }
  return state;
};
