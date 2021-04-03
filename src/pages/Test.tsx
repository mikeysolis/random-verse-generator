import { useEffect } from 'react';
import { IonContent, IonPage, IonButton } from '@ionic/react';

import { useAppContext } from '../lib/State';
import { ActionType } from '../lib/reducer';

interface TestProps {}

const Test: React.FC<TestProps> = () => {
  const { state, dispatch } = useAppContext()!;

  useEffect(() => {
    console.log('count: ', state.count);
  }, [state]);

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <div>
          <IonButton
            onClick={() =>
              dispatch({
                type: ActionType.SET_COUNT,
                count: state.count + 1,
              })
            }
          >
            Add to Order
          </IonButton>
          <h2>You have {state.count} in your cart</h2>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Test;
