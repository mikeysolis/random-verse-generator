import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

import { auth, firestore } from '../firebase/config';

type CategoryType = {
  id: string;
  name: string;
  count: number;
};

function useProviderValue() {
  const [user] = useAuthState(auth);
  const [status, setStatus] = React.useState<string | null>(null);
  const [categories, setCategories] = React.useState<CategoryType[]>([]);

  React.useEffect(() => {
    // Turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot(doc => {
        setStatus(doc.data()?.status);
      });
    } else {
      setStatus(null);
    }

    return unsubscribe;
  }, [user]);

  React.useEffect(() => {
    let unsubscribe;

    if (user) {
      const ref = firestore
        .collection('users')
        .doc(user.uid)
        .collection('categories');
      unsubscribe = ref.onSnapshot(snapshot => {
        let categories: CategoryType[] = [];
        snapshot.forEach(category => {
          const { id, name, count } = category.data();
          categories.push({ id, name, count });
        });
        setCategories(categories);
      });
    }

    return unsubscribe;
  }, [user]);

  return {
    user,
    status,
    categories,
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

// type ContextProps = {
//   user: firebase.User | null | undefined;
//   userStatus: string | null;
// };

// export const UserContext = createContext<Partial<ContextProps>>({
//   user: null,
//   userStatus: null,
// });
