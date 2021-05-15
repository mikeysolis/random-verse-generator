/**
 * Favs: Feature allowing the user to save and revisit favorite
 * scriptures.
 */

import { Suspense, useState } from 'react';
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
  IonInput,
  IonButton,
  IonText,
  useIonToast,
  IonBadge,
} from '@ionic/react';
import { trash, add } from 'ionicons/icons';

import './Favorites.css';
import { useAppSelector, useAppDispatch } from '../lib/store/hooks';
import {
  loadCategories,
  deleteCategory,
  addCategory,
} from '../lib/store/categoriesSlice';
import { loadFavorites } from '../lib/store/favoritesSlice';
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
  // Set up the IonToast to alert user if favorite has been successfully deleted
  const [presentToast, dismissToast] = useIonToast();
  // Setup state for the add category input
  const [inputValue, setInputValue] = useState<string>('');
  // Grab the apps dispatch method for handling state
  const dispatch = useAppDispatch();
  // Grab the current categories state from redux
  const { categories } = useAppSelector(state => state);
  // Grabh the current user
  const { data: user } = useUser();

  useEffect(() => {
    dispatch(loadCategories(user.uid));
    dispatch(loadFavorites(user.uid));
  }, [dispatch, user.uid]);

  const categoryDeleteHandler = (category: Category) => {
    dispatch(deleteCategory({ uid: user.uid, category }));
    presentToast({
      buttons: [{ text: 'close', handler: () => dismissToast() }],
      message: 'Category successfully deleted.',
      duration: 2000,
      color: 'dark',
    });
  };

  const addCategoryHandler = () => {
    // Replace whitespace with dashes and convert id to lowercase
    const id = inputValue.replace(/\s+/g, '-').toLowerCase();

    // TODO: needs to add some input validation
    // Setup the object to be dispatched
    const category = {
      uid: user.uid,
      category: {
        id,
        name: inputValue,
        count: 0,
      },
    };

    dispatch(addCategory(category));

    setInputValue('');

    presentToast({
      buttons: [{ text: 'close', handler: () => dismissToast() }],
      message: 'Category successfully added.',
      duration: 2000,
      color: 'dark',
    });
  };

  return (
    <SubscribeCheck fallback={<UnSubscribed />}>
      <div className="add-category-input">
        <IonInput
          enterkeyhint="done"
          inputmode="text"
          maxlength={30}
          minlength={3}
          required={true}
          type="text"
          value={inputValue}
          onIonInput={(e: any) => setInputValue(e.target.value)}
          autocorrect="on"
          color="primary"
          placeholder="Add a new category"
        ></IonInput>
        <IonButton fill="solid" color="warning" onClick={addCategoryHandler}>
          <IonIcon icon={add} size="large" />
        </IonButton>
      </div>
      <IonList className="favorites-list" lines="full">
        <IonListHeader>
          <IonLabel>My Categories</IonLabel>
        </IonListHeader>
        {categories.data.length === 0 && <IonItem>No categories yet</IonItem>}
        {categories.data.map(category => (
          <CategoryItem
            key={category.name}
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
      <IonItem
        button={true}
        detail={true}
        disabled={category.count! < 1}
        color="secondary"
        routerLink={`/favorites/${category.id}`}
      >
        <IonText className="ion-text-capitalize">{category.name}</IonText>
        <IonBadge slot="end" color="primary">
          {category.count}
        </IonBadge>
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
