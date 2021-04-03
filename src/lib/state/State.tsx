import React, { createContext, useReducer } from 'react';

import { reducer, Action } from './reducer';
import { logger } from '../utils/logger';

const loggerReducer = logger(reducer);

export interface Verse {
  volumeTitle: string;
  verseTitle: string;
  scriptureText: string;
  verseId: number;
}

export interface StateContext {
  verses: Verse[];
}

interface Store {
  state: StateContext;
  dispatch: React.Dispatch<Action>;
}

const initialState: StateContext = {
  verses: [],
};

let AppContext = createContext<Store>({
  state: initialState,
  dispatch: () => null,
});

export const AppContextProvider: React.FC = ({ children }) => {
  const fullInitialState = {
    ...initialState,
  };

  let [state, dispatch] = useReducer(loggerReducer, fullInitialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export function useAppContext() {
  const context = React.useContext(AppContext);

  if (context === undefined) {
    throw new Error(`useAppContext must be used within a Provider`);
  }

  return context;
}
