/**
 * Favs: Feature allowing the user to save and revisit favorite
 * scriptures.
 */

import { Suspense } from 'react';
import { AuthCheck } from 'reactfire';
import {
  IonContent,
  IonPage,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardContent,
} from '@ionic/react';

import LoadingSpinner from '../components/LoadingSpinner';
import { SubscribeCheck, SignInWithGoogle } from '../components/Customers';

const Favs: React.FC = () => {
  return (
    <IonPage>
      <IonContent color="secondary">
        <Suspense fallback={<LoadingSpinner />}>
          <AuthCheck fallback={<LoggedOut />}>
            <SubscribeCheck fallback={<UnSubscribed />}>
              <p>You are subscribed</p>
            </SubscribeCheck>
          </AuthCheck>
        </Suspense>
      </IonContent>
    </IonPage>
  );
};

// Show to the user if logged out
const LoggedOut: React.FC = ({ children }) => {
  return (
    <div className="container">
      <IonCard>
        <IonCardHeader>
          <IonCardSubtitle>Favorites</IonCardSubtitle>
          <IonCardContent>
            Start saving and organizing your favorite verses to the Cloud by
            signing in with your preferred provider.
          </IonCardContent>
        </IonCardHeader>
        <SignInWithGoogle />
      </IonCard>
    </div>
  );
};

// Show to the user if they don't have an active subscription
const UnSubscribed: React.FC = () => {
  return (
    <>
      <p>unsubbed</p>
    </>
  );
};

export default Favs;
