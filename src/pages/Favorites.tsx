/**
 * Favs: Feature allowing the user to save and revisit favorite
 * scriptures.
 */

import { Suspense } from 'react';
import { AuthCheck, useUser } from 'reactfire';
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonLabel,
  IonListHeader,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
} from '@ionic/react';
import { trash } from 'ionicons/icons';

import './Favorites.css';
import { useAppSelector, useAppDispatch } from '../lib/store/hooks';
import { loadCategories, deleteCategory } from '../lib/store/categoriesSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { BasicCard } from '../components/Cards';
import { SubscribeCheck, SignInWithGoogle } from '../components/Customers';
import { useEffect } from 'react';
import { Category } from '../lib/store/types';

const Favs: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Favorites</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Suspense fallback={<LoadingSpinner />}>
          <AuthCheck fallback={<LoggedOut />}>
            <LoggedIn />
          </AuthCheck>
        </Suspense>
      </IonContent>
    </IonPage>
  );
};

// Show to the user if logged in
const LoggedIn: React.FC = () => {
  // Grab the apps dispatch method for handling state
  const dispatch = useAppDispatch();
  // Grab the current categories state from redux
  const { categories } = useAppSelector(state => state);
  // Grabh the current user
  const { data: user } = useUser();

  useEffect(() => {
    dispatch(loadCategories(user.uid));
  }, [dispatch, user.uid]);

  const categoryDeleteHandler = (category: Category) => {
    dispatch(deleteCategory({ uid: user.uid, category }));
  };

  return (
    <SubscribeCheck fallback={<UnSubscribed />}>
      <IonList className="favorites-list" inset={true}>
        <IonListHeader>
          <IonLabel>Categories</IonLabel>
        </IonListHeader>
        {categories.data.length === 0 && <IonItem>No categories yet</IonItem>}
        {categories.data.map(category => (
          <CategoryItem
            key={category.displayName}
            category={category}
            deleteHandler={categoryDeleteHandler}
          />
        ))}
      </IonList>
    </SubscribeCheck>
  );
};

// Show to the user if logged out
const LoggedOut: React.FC = ({ children }) => {
  return (
    <BasicCard title="Login Required" button={<SignInWithGoogle />}>
      Please login to view your Favorites. A Free Trial or Subscription is
      required to use this feature.
    </BasicCard>
  );
};

// Show to the user if they don't have an active subscription
const UnSubscribed: React.FC = () => {
  return (
    <BasicCard title="Subscription Required">
      It appears your Free Trial or Subscription has expired. To view your
      Favorites please visit your account page to update your Subscription.
    </BasicCard>
  );
};

// Component that displays in individual favorite item
interface CategoryItemProps {
  deleteHandler: (category: Category) => void;
  category: Category;
}
const CategoryItem: React.FC<CategoryItemProps> = ({
  deleteHandler,
  category,
}) => {
  const onTapDeleteHandler = (category: Category) => {
    deleteHandler(category);
  };

  return (
    <IonItemSliding>
      <IonItem button={true} detail={false} color="secondary">
        {category.displayName}
      </IonItem>
      <IonItemOptions>
        <IonItemOption
          color="danger"
          onClick={() => onTapDeleteHandler(category)}
        >
          <IonIcon slot="start" icon={trash} />
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default Favs;
