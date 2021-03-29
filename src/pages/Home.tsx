import { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
} from '@ionic/react';

import './Home.css';
import { GET_RANDOM_VERSES } from '../lib/queries';
import ScriptureSlides from '../components/ScriptureSlides';
import VolumeSegment from '../components/VolumeSegment';

export interface IVerse {
  volumeTitle: string;
  verseTitle: string;
  scriptureText: string;
  verseId: number;
}

const Home: React.FC = () => {
  const [volumeId, setVolumeId] = useState<string | undefined>('');
  const [verses, setVerses] = useState<IVerse[]>([]);

  const [fetchVerses, { loading }] = useLazyQuery(GET_RANDOM_VERSES, {
    variables: {
      limit: 1,
      volumeId,
    },
    onCompleted: async data => {
      setVerses([...verses, ...data.get_random_verses]);
    },
    onError: error => {
      console.log('error', error);
    },
    fetchPolicy: 'no-cache',
  });

  const onIonSegmentChangeHandler = (e: any) => {
    setVolumeId(e.detail.value);
    fetchVerses();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Scripture Generator</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Scripture Generator</IonTitle>
          </IonToolbar>
        </IonHeader>
        <VolumeSegment changeHandler={onIonSegmentChangeHandler} />
        <div className="container">
          {loading ? (
            <IonSpinner />
          ) : (
            <ScriptureSlides volumeId={volumeId} verses={verses} />
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
