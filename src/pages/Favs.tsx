/**
 * Favs: Feature allowing the user to save and revisit favorite
 * scriptures.
 */

import { Suspense } from 'react';
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
} from '@ionic/react';
import { trash } from 'ionicons/icons';

import './Favs.css';
import LoadingSpinner from '../components/LoadingSpinner';
import { BasicCard } from '../components/Cards';
import { SubscribeCheck, SignInWithGoogle } from '../components/Customers';
import { Verse } from '../lib/store/types';

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
  // Grab the current user
  const { data: user } = useUser();
  // Retrieve the users favorites Ref from firebase
  const userFavoritesRef = useFirestore()
    .collection('users')
    .doc(user?.uid)
    .collection('favorites');
  // Subscribe to the users Favorites collection
  const { data: favorites } = useFirestoreCollectionData<Verse>(
    userFavoritesRef
  );

  return (
    <>
      <SubscribeCheck fallback={<UnSubscribed />}>
        {favorites.length === 0 ? (
          <BasicCard title="No Favorite Verses">
            Once you save a verse as a Favorite it will show up here. Go save a
            Fave!
          </BasicCard>
        ) : (
          <IonList className="favorites-list" inset={true}>
            {favorites.map(favorite => (
              <FavoriteItem key={favorite.verseId}>
                <div>
                  <h5>{favorite.verseTitle}</h5>
                  <p>{favorite.scriptureText}</p>
                </div>
              </FavoriteItem>
            ))}
          </IonList>
        )}
      </SubscribeCheck>
    </>
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
const FavoriteItem: React.FC = ({ children }) => {
  return (
    <IonItemSliding>
      <IonItem button={true} detail={false} lines="none" color="secondary">
        {children}
      </IonItem>
      <IonItemOptions>
        <IonItemOption color="warning">
          <IonIcon slot="start" icon={trash} />
          Delete
        </IonItemOption>
      </IonItemOptions>
    </IonItemSliding>
  );
};

export default Favs;
