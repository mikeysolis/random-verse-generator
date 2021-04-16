import { useState, ReactElement } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonInfiniteScroll,
  IonSpinner,
  IonHeader,
  IonToolbar,
} from '@ionic/react';

import './Home.css';
import { useAppSelector, useAppDispatch } from '../lib/store/hooks';
import { concat, clear } from '../lib/store/versesSlice';
import { updateBookmarks } from '../lib/store/bookmarksSlice';
import { isBookmarked } from '../lib/utils/utils';
import { Verse } from '../lib/store/types';
import { GET_RANDOM_VERSES_FROM_VOLUME } from '../lib/apollo/queries';
import SkeletonCards from '../components/SkeletonCards';
import VerseCard from '../components/VerseCard';

const LIMIT = 10;

const Home: React.FC = () => {
  const state = useAppSelector(state => state);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [volumeId, setVolumeId] = useState<number | undefined>(undefined);
  const [fetchVerses] = useLazyQuery(GET_RANDOM_VERSES_FROM_VOLUME, {
    onCompleted: async data => {
      dispatch(concat(data.get_random_verses_from_volume));
      setLoading(false);
    },
    onError: error => {
      console.log('error', error);
    },
    fetchPolicy: 'no-cache',
  });

  const loadData = ($event: CustomEvent<void>) => {
    fetchVerses({
      variables: {
        limit: LIMIT,
        volumeId,
      },
    });
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  };

  const onIonSegmentChangeHandler = (e: any) => {
    setLoading(true);
    dispatch(clear());
    setVolumeId(e.detail.value);
    fetchVerses({
      variables: {
        limit: LIMIT,
        volumeId: e.detail.value,
      },
    });
  };

  const onBookmarkClickHandler = (verse: Verse) => {
    dispatch(updateBookmarks(verse));
  };

  if (loading) {
    return (
      <HomeLayout
        header={<VolumeSegment changeHandler={onIonSegmentChangeHandler} />}
      >
        <SkeletonCards />
      </HomeLayout>
    );
  }

  if (state.verses.data.length === 0) {
    return (
      <HomeLayout
        header={<VolumeSegment changeHandler={onIonSegmentChangeHandler} />}
      >
        <div className="container">
          <p>Please select a volume of scriptures.</p>
        </div>
      </HomeLayout>
    );
  }

  return (
    <HomeLayout
      header={<VolumeSegment changeHandler={onIonSegmentChangeHandler} />}
    >
      {state.verses.data.map((verse: any, i: number) => (
        <VerseCard
          key={`${i}-${verse.verseId}`}
          verse={verse}
          isBookmarked={isBookmarked(verse.verseId, state.bookmarks.data)}
          onBookmarkClickHandler={() => onBookmarkClickHandler(verse)}
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

interface HomeLayoutProps {
  header: ReactElement;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ header, children }) => (
  <IonPage>
    <IonHeader>
      <IonToolbar>{header}</IonToolbar>
    </IonHeader>
    <IonContent color="secondary">{children}</IonContent>
  </IonPage>
);

interface VolumeSegmentProps {
  changeHandler: (e: any) => void;
}

const VolumeSegment: React.FC<VolumeSegmentProps> = ({ changeHandler }) => {
  const onIonChangeHandler = (e: any) => {
    changeHandler(e);
  };

  return (
    <IonSegment
      onIonChange={onIonChangeHandler}
      scrollable={true}
      swipeGesture={false}
      color="secondary"
    >
      <IonSegmentButton value="1">
        <IonLabel>OT</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="2">
        <IonLabel>NT</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="3">
        <IonLabel>BM</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="4">
        <IonLabel>DC</IonLabel>
      </IonSegmentButton>
      <IonSegmentButton value="5">
        <IonLabel>PGP</IonLabel>
      </IonSegmentButton>
    </IonSegment>
  );
};

export default Home;
