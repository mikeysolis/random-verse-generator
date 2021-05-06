/**
 * Favs: Feature allowing the user to save and revisit favorite
 * scriptures.
 */

import { Suspense } from 'react';
import { AuthCheck } from 'reactfire';
import { IonContent, IonPage, IonSpinner } from '@ionic/react';

import { SubscribeCheck, SignIn } from '../components/Customers';

const Favs: React.FC = () => {
  return (
    <IonPage>
      <IonContent color="secondary">
        <div className="container">
          <Suspense fallback={<IonSpinner />}>
            <AuthCheck fallback={<SignIn />}>
              <SubscribeCheck>
                <p>You are subscribed</p>
              </SubscribeCheck>
            </AuthCheck>
          </Suspense>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Favs;
