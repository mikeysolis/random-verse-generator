import React from 'react';

export interface IVerse {
  volumeTitle: string;
  verseTitle: string;
  scriptureText: string;
  verseId: number;
}

function useProviderValue() {
  const [verses, setVerses] = React.useState<IVerse[]>([]);

  const updateVerses = (newVerses: IVerse[], sliderIndex: number) => {
    const oldArray = verses.slice(0, sliderIndex + 1);
    setVerses([...oldArray, ...newVerses]);
  };

  return {
    verses,
    updateVerses,
  };
}

export type ContextType = ReturnType<typeof useProviderValue>;

const Context = React.createContext<ContextType | undefined>(undefined);
Context.displayName = 'Context';

export const ContextProvider: React.FC = props => {
  const value = useProviderValue();
  return <Context.Provider value={value} {...props} />;
};

export function useContext() {
  const context = React.useContext(Context);

  if (context === undefined) {
    throw new Error(`useContext must be used within a Provider`);
  }

  return context;
}
