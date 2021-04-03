import { IonContent, IonPage, IonButton } from '@ionic/react';
import { useLazyQuery } from '@apollo/client';

import { useAppContext } from '../lib/state/State';
import { ActionType } from '../lib/state/reducer';
import { GET_RANDOM_VERSES } from '../lib/apollo/queries';

interface TestProps {}

const Test: React.FC<TestProps> = () => {
  const { state, dispatch } = useAppContext();
  const [fetchVerses, { loading }] = useLazyQuery(GET_RANDOM_VERSES, {
    variables: {
      limit: 5,
      volumeId: 3,
    },
    onCompleted: async data => {
      dispatch({
        type: ActionType.ADD_VERSES,
        payload: {
          verses: data.get_random_verses,
          sliderIndex: 2,
        },
      });
    },
    onError: error => {
      console.log('error', error);
    },
    fetchPolicy: 'no-cache',
  });

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div>
            <IonButton onClick={() => fetchVerses()}>Fetch Verses</IonButton>
            <p>Loading...</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  if (state.verses.length === 0) {
    return (
      <IonPage>
        <IonContent className="ion-padding">
          <div>
            <IonButton onClick={() => fetchVerses()}>Fetch Verses</IonButton>
            <p>Please load some verses</p>
          </div>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div>
          <IonButton onClick={() => fetchVerses()}>Fetch Verses</IonButton>
          {state.verses.map((verse, i) => (
            <p key={i}>Verse: {verse.verseTitle}</p>
          ))}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Test;
