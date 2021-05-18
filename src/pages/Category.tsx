/**
 * Favs: Feature allowing the user to save and revisit favorite
 * scriptures.
 */

import { Suspense, useState } from 'react';
import {
  useFirestore,
  useFirestoreCollectionData,
  AuthCheck,
  useUser,
} from 'reactfire';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  useIonToast,
  IonText,
  IonButtons,
  IonBackButton,
  useIonModal,
} from '@ionic/react';

import './Category.css';
import LoadingSpinner from '../components/LoadingSpinner';
import { BasicCard } from '../components/Cards';
import FavoriteCard from '../components/FavoriteCard';
import { SubscribeCheck, SignInWithGoogle } from '../components/Customers';
import { RouteComponentProps } from 'react-router';
import { Favorite, Category } from '../lib/store/types';
import EditFavoriteModal from '../components/EditFavoriteModal';
import ViewFavoriteModal from '../components/ViewFavoriteModal';
import AlertPopup from '../components/AlertPopup';
import { deleteFavorite } from '../lib/firebase/db';

interface CategoryProps
  extends RouteComponentProps<{
    id: string;
  }> {}

const CategoryPage: React.FC<CategoryProps> = ({ match }) => {
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
  // State to track whether to show the logged in alert
  const [loggedInAlert, setLoggedInAlert] = useState<boolean>(false);
  // Grab the current user
  const { data: user } = useUser();
  // State to track the current verse the user has selected to set as a Favorite
  const [favoriteVerse, setFavoriteVerse] = useState<Favorite | null>(null);

  // Grab the current users categories
  const userCategoriesRef = useFirestore()
    .collection('users')
    .doc(user?.uid)
    .collection('categories');
  const { data: categories } =
    useFirestoreCollectionData<Category>(userCategoriesRef);

  // Grab the current users favorites
  const userFavoritesRef = useFirestore()
    .collection('users')
    .doc(user!.uid)
    .collection('favorites')
    .where('categoryId', '==', id);
  const { data: favorites } =
    useFirestoreCollectionData<Favorite>(userFavoritesRef);

  // Handler that runs when a user taps to close the Favorites Modal
  const handleEditFavoriteModalDismiss = () => {
    dismissEditFavoriteModal();
  };

  // Setup the IonModal hook that pops up when the user taps the Favorites button
  const [presentEditFavoriteModal, dismissEditFavoriteModal] = useIonModal(
    EditFavoriteModal,
    {
      user,
      favorite: favoriteVerse,
      categories,
      onDismiss: handleEditFavoriteModalDismiss,
    }
  );

  // Handler that runs when a user taps to close the View Favorite Modal
  const handleViewFavoriteModalDismiss = () => {
    dismissViewFavoriteModal();
  };

  // Setup the IonModal hook that pops up when the user taps the Favorites button
  const [presentViewFavoriteModal, dismissViewFavoriteModal] = useIonModal(
    ViewFavoriteModal,
    {
      favorite: favoriteVerse,
      onDismiss: handleViewFavoriteModalDismiss,
    }
  );

  // Run when the user taps the Favorites button for the verse
  const onEditFavoriteClickHandler = (favorite: Favorite) => {
    setFavoriteVerse(favorite);

    // If the user is logged in present the modal, if not
    // present an alert.
    if (user) {
      presentEditFavoriteModal({ cssClass: 'edit-favorite-modal' });
    } else {
      setLoggedInAlert(true);
    }
  };

  const onDeleteFavoriteClickHandler = async (favorite: Favorite) => {
    try {
      await deleteFavorite(user.uid, favorite);
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

  const onViewFavoriteClickHandler = async (favorite: Favorite) => {
    setFavoriteVerse(favorite);
    presentViewFavoriteModal({ cssClass: 'view-favorite-modal' });
  };

  return (
    <SubscribeCheck fallback={<UnSubscribed />}>
      <AlertPopup
        showAlert={loggedInAlert}
        setShowAlert={setLoggedInAlert}
        header="Not Logged In"
        message="The Favorites feature saves your favorite verses to the cloud 
        and requires users to be logged in. For now we recommend Bookmarking the verse, 
        then you can easily find it later if you would still like to save it as a Favorite."
      />

      {favorites.length === 0 ? (
        <BasicCard title="No Favorites Found">
          Once you add or update a Favorite's category to '{id}', it will show
          up here.
        </BasicCard>
      ) : (
        favorites.map((favorite, i) => (
          <FavoriteCard
            key={`${i}-${favorite.verseId}`}
            favorite={favorite}
            onEditFavoriteClickHandler={onEditFavoriteClickHandler}
            onDeleteFavoriteClickHandler={onDeleteFavoriteClickHandler}
            onViewFavoriteClickHandler={onViewFavoriteClickHandler}
          />
        ))
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

export default CategoryPage;
