import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  useIonViewWillEnter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonCard,
} from '@ionic/react';

import { useAppContext } from '../lib/state/State';
import { ActionType } from '../lib/state/reducer';
import { GET_RANDOM_VERSES } from '../lib/apollo/queries';

interface TestProps {}

const Test: React.FC<TestProps> = () => {
  const { state, dispatch } = useAppContext();
  const [volumeId, setVolumeId] = useState<number | undefined>(1);
  const [disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(
    false
  );
  const [fetchVerses, { loading }] = useLazyQuery(GET_RANDOM_VERSES, {
    variables: {
      limit: 10,
      volumeId,
    },
    onCompleted: async data => {
      dispatch({
        type: ActionType.ADD_VERSES,
        payload: {
          verses: data.get_random_verses,
        },
      });
      setDisableInfiniteScroll(state.verses.length >= 20 ? true : false);
    },
    onError: error => {
      console.log('error', error);
    },
    fetchPolicy: 'no-cache',
  });

  useIonViewWillEnter(async () => {
    fetchVerses();
  });

  const loadData = ($event: CustomEvent<void>) => {
    fetchVerses();
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  };

  return (
    <TestLayout setVolumeId={setVolumeId}>
      {state.verses.map((verse: any, i: number) => (
        <IonCard key={`i-${verse.verseId}`}>
          <p>Verse Title: {verse.verseTitle}</p>
          <p>{verse.scriptureText}</p>
        </IonCard>
      ))}
      <IonInfiniteScroll
        disabled={disableInfiniteScroll}
        onIonInfinite={(e: CustomEvent<void>) => loadData(e)}
      >
        <IonInfiniteScrollContent
          loadingSpinner="bubbles"
          loadingText="Loading more verses..."
        ></IonInfiniteScrollContent>
      </IonInfiniteScroll>
    </TestLayout>
  );
};

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

interface TestLayoutProps {
  setVolumeId: (e: any) => void;
}

const TestLayout: React.FC<TestLayoutProps> = ({ setVolumeId, children }) => {
  const onIonSegmentChangeHandler = (e: any) => {
    setVolumeId(e.detail.value);
    console.log('event: ', e.detail.value);
  };

  return (
    <IonPage>
      <IonContent color="primary">{children}</IonContent>
      <VolumeSegment changeHandler={onIonSegmentChangeHandler} />
    </IonPage>
  );
};

export default Test;
