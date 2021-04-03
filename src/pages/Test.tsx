import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  IonContent,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonInfiniteScroll,
  IonSpinner,
  IonCard,
} from '@ionic/react';

import './Test.css';
import SkeletonVerse from '../components/SkeletonVerse';
import { useAppContext } from '../lib/state/State';
import { ActionType } from '../lib/state/reducer';
import { GET_RANDOM_VERSES_FROM_VOLUME } from '../lib/apollo/queries';

const Test: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);
  const [volumeId, setVolumeId] = useState<number | undefined>(undefined);
  const [fetchVerses] = useLazyQuery(GET_RANDOM_VERSES_FROM_VOLUME, {
    variables: {
      limit: 10,
      volumeId,
    },
    onCompleted: async data => {
      dispatch({
        type: ActionType.CONCAT_VERSES,
        payload: {
          verses: data.get_random_verses_from_volume,
        },
      });
      setLoading(false);
    },
    onError: error => {
      console.log('error', error);
    },
    fetchPolicy: 'no-cache',
  });

  const loadData = ($event: CustomEvent<void>) => {
    fetchVerses();
    ($event.target as HTMLIonInfiniteScrollElement).complete();
  };

  const onIonSegmentChangeHandler = (e: any) => {
    setLoading(true);
    dispatch({
      type: ActionType.CLEAR_VERSES,
      payload: {
        verses: [],
      },
    });
    setVolumeId(e.detail.value);
    fetchVerses();
  };

  if (loading) {
    return (
      <IonPage>
        <VolumeSegment changeHandler={onIonSegmentChangeHandler} />
        <IonContent color="primary">
          <div className="container">
            <SkeletonVerse />
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (state.verses.length === 0) {
    return (
      <IonPage>
        <VolumeSegment changeHandler={onIonSegmentChangeHandler} />
        <IonContent color="primary">
          <div className="container">
            <p>Please select a volume of scripture.</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <VolumeSegment changeHandler={onIonSegmentChangeHandler} />
      <IonContent color="primary">
        {state.verses.map((verse: any, i: number) => (
          <IonCard key={`${i}-${verse.verseId}`}>
            <p>Verse Title: {verse.verseTitle}</p>
            <p>{verse.scriptureText}</p>
          </IonCard>
        ))}
        <IonInfiniteScroll
          onIonInfinite={(e: CustomEvent<void>) => loadData(e)}
        >
          <div className="spinner">
            <IonSpinner />
          </div>
        </IonInfiniteScroll>
      </IonContent>
    </IonPage>
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

export default Test;
