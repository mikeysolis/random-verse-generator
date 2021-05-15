/**
 * Favs: Feature allowing the user to save and revisit favorite
 * scriptures.
 */

import { Suspense, useEffect, useState } from 'react';
import {
  useFirestore,
  useFirestoreCollectionData,
  AuthCheck,
  useUser,
} from 'reactfire';
import {
  IonContent,
  IonPage,
  IonList,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  IonIcon,
  useIonToast,
  IonText,
  IonButtons,
  IonBackButton,
} from '@ionic/react';
import { filter, trash } from 'ionicons/icons';

import './Category.css';
import { deleteFavorite } from '../lib/firebase/db';
import LoadingSpinner from '../components/LoadingSpinner';
import { BasicCard } from '../components/Cards';
import { SubscribeCheck, SignInWithGoogle } from '../components/Customers';
import { useAppSelector } from '../lib/store/hooks';
import { RouteComponentProps } from 'react-router';
import { Favorite } from '../lib/store/types';

interface CategoryProps
  extends RouteComponentProps<{
    id: string;
  }> {}

const Category: React.FC<CategoryProps> = ({ match }) => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>
            <IonText className="ion-text-capitalize">
              {match.params.id.replace(/-/g, ' ')}
            </IonText>
          </IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <Suspense fallback={<LoadingSpinner />}>
          <AuthCheck fallback={<LoggedOut />}>
            <LoggedIn id={match.params.id} />
          </AuthCheck>
        </Suspense>
      </IonContent>
    </IonPage>
  );
};

// Show to the user if logged in
const LoggedIn: React.FC<{ id: string }> = ({ id }) => {
  // Set up the IonToast to alert user if favorite has been successfully deleted
  const [presentToast, dismissToast] = useIonToast();
  // Grab the current user
  const { data: user } = useUser();
  // Grab the current categories state from redux
  const { data: favorites } = useAppSelector(state => state.favorites);
  const [favsByCategory, setFavsByCategory] = useState<Favorite[]>([]);

  // const filteredFavorites = (id: string): Favorite[] => {
  //   return favorites.filter(fav => fav.categoryId === id);
  // };

  useEffect(() => {
    const filteredFavorites = favorites.filter(fav => fav.categoryId === id);
    setFavsByCategory(filteredFavorites);
  }, [favorites, id]);

  const deleteFavoriteHandler = async (verseTitle: string) => {
    try {
      await deleteFavorite(user.uid, verseTitle);
      presentToast({
        buttons: [{ text: 'close', handler: () => dismissToast() }],
        message: 'Favorite successfully deleted.',
        duration: 2000,
        color: 'dark',
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SubscribeCheck fallback={<UnSubscribed />}>
      {favorites.length === 0 ? (
        <BasicCard title="No Favorite Verses">
          Once you save a verse as a Favorite it will show up here. Go save a
          Fave!
        </BasicCard>
      ) : (
        <IonList className="favorites-list" inset={true}>
          {favsByCategory.map(({ verseId, verseTitle, scriptureText }) => (
            <FavoriteItem
              key={verseId}
              verseTitle={verseTitle!}
              deleteFavoriteHandler={deleteFavoriteHandler}
            >
              <div>
                <h5>{verseTitle}</h5>
                <p>{scriptureText}</p>
              </div>
            </FavoriteItem>
          ))}
        </IonList>
      )}
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
interface FavoriteItemProps {
  deleteFavoriteHandler: (verseTitle: string) => void;
  verseTitle: string;
}
const FavoriteItem: React.FC<FavoriteItemProps> = ({
  deleteFavoriteHandler,
  verseTitle,
  children,
}) => {
  const onDeleteFavoriteHandler = (verseTitle: string) => {
    deleteFavoriteHandler(verseTitle);
  };

  return (
    <IonItemSliding>
      <IonItem button={true} detail={false} color="secondary">
        {children}
      </IonItem>
      <IonItemOptions>
        <IonItemOption
          color="warning"
          onClick={() => onDeleteFavoriteHandler(verseTitle)}
        >
          <IonIcon slot="start" icon={trash} />
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default Category;