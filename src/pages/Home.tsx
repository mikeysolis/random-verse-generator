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
// import { IVerse } from '../lib/context';
import { GET_RANDOM_VERSES } from '../lib/queries';
import { useContext } from '../lib/context';
import ScriptureSlides from '../components/ScriptureSlides';
import VolumeSegment from '../components/VolumeSegment';

const Home: React.FC = () => {
  const { verses, setVerses } = useContext();
  const [volumeId, setVolumeId] = useState<string | undefined>('');
  // const [verses, setVerses] = useState<IVerse[]>([]);

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
