/**
 * Page: Home
 * Landing page for the entire app. Once onboarding is completed
 * the user is directed here and may start browsing verses.
 */

import { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInfiniteScroll,
  IonSpinner,
  IonHeader,
  IonToolbar,
  useIonModal,
} from '@ionic/react';

import { useUserContext } from '../lib/user/context';
import AddFavoriteModal from '../components/AddFavoriteModal';
import { useAppSelector, useAppDispatch } from '../lib/store/hooks';
import { clear, concatVerses } from '../lib/store/versesSlice';
import { updateBookmarks } from '../lib/store/bookmarksSlice';
import { isBookmarked } from '../lib/utils/helpers';
import { Verse } from '../lib/types';
import SkeletonCards from '../components/SkeletonCards';
import { BasicCard } from '../components/Cards';
import VerseCard from '../components/VerseCard';
import FavoriteModal from '../components/AddFavoriteModal';
import VolumeSegment from '../components/VolumeSegment';

const Home: React.FC = () => {
  // Grab the apps dispatch method for handling state
  const dispatch = useAppDispatch();
  // Grab the current context
  const { user, categories } = useUserContext();
  // Grab the current verses and bookmarks state from redux
  const { verses, bookmarks } = useAppSelector(state => state);
  // Track the current VolumeID for the row of buttons at the top of the display
  const [volumeId, setVolumeId] = useState<string>('1');
  // Loading state to show or hide the skeleton text
  const [loading, setLoading] = useState<boolean>(false);
  // State to track the current verse the user has selected to set as a Favorite
  const [favoriteVerse, setFavoriteVerse] = useState<Verse | null>(null);
  // State for opening and closing the AddFavoriteModal
  // const [showAddFavoriteModal, setShowAddFavoriteModal] =
  //   useState<boolean>(false);

  // Handler that runs when a user taps to close the Favorites Modal
  const handleAddFavoriteModalDismiss = () => {
    dismissAddFavoriteModal();
  };

  // Setup the IonModal hook that pops up when the user taps the Favorites button
  const [presentAddFavoriteModal, dismissAddFavoriteModal] = useIonModal(
    AddFavoriteModal,
    {
      user,
      favorite: favoriteVerse,
      categories,
      onDismiss: handleAddFavoriteModalDismiss,
    }
  );

  // Function to dispatch a redux action that pulls more verses from the API
  const loadData = ($event: CustomEvent<void>) => {
    dispatch(concatVerses(volumeId));
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  };

  // Function is run when the user changes the Volume of scripture
  const onIonSegmentChangeHandler = async (e: CustomEvent) => {
    setLoading(true);
    setVolumeId(e.detail.value);
    dispatch(clear());
    await dispatch(concatVerses(e.detail.value));
    setLoading(false);
  };

  // Run when the user taps the Bookmark button for the verse
  const onBookmarkClickHandler = (verse: Verse) => {
    dispatch(updateBookmarks(verse));
  };

  // Run when the user taps the Favorites button for the verse
  const onFavoriteClickHandler = (verse: Verse) => {
    setFavoriteVerse(verse);
    presentAddFavoriteModal({ cssClass: 'add-favorite-modal' });
  };

  // If verses are loading from Scripture API show skeleton cards.
  if (loading) {
    return (
      <HomeLayout onIonSegmentChangeHandler={onIonSegmentChangeHandler}>
        <SkeletonCards />
      </HomeLayout>
    );
  }

  // If unable to complete a fetch to scripture API show an error.
  if (verses.loading === 'failed') {
    return (
      <HomeLayout onIonSegmentChangeHandler={onIonSegmentChangeHandler}>
        <BasicCard title="Error">{verses.error}</BasicCard>
      </HomeLayout>
    );
  }

  // If the user hasn't fetched any verses
  if (verses.data.length === 0) {
    return (
      <HomeLayout onIonSegmentChangeHandler={onIonSegmentChangeHandler}>
        <BasicCard title="Select a Volume">
          Please select a volume of scripture from the menu above.
        </BasicCard>
      </HomeLayout>
    );
  }

  // A successfull fetch will end up here. Display the vereses and
  // setup the infinite scroll.
  return (
    <HomeLayout onIonSegmentChangeHandler={onIonSegmentChangeHandler}>
      {verses.data.map((verse: any, i: number) => (
        <VerseCard
          key={`${i}-${verse.verseId}`}
          verse={verse}
          isBookmarked={isBookmarked(verse.verseId, bookmarks.data)}
          onBookmarkDeleteClickHandler={() => onBookmarkClickHandler(verse)}
          onFavoriteClickHandler={() => onFavoriteClickHandler(verse)}
          isVerseForMenu={false}
        />
      ))}
      <IonInfiniteScroll onIonInfinite={(e: CustomEvent<void>) => loadData(e)}>
        <div className="spinner">
          <IonSpinner />
        </div>
      </IonInfiniteScroll>
    </HomeLayout>
  );
};

/**
 * Component: HomeLayout
 * Encapsulate the basic page layout here to decrease complexity above.
 */
interface HomeLayoutProps {
  onIonSegmentChangeHandler: (e: CustomEvent) => void;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({
  onIonSegmentChangeHandler,
  children,
}) => (
  <IonPage>
    <IonHeader>
      <IonToolbar color="primary">
        <VolumeSegment changeHandler={onIonSegmentChangeHandler} />
      </IonToolbar>
    </IonHeader>
    <IonContent>{children}</IonContent>
  </IonPage>
);

export default Home;
