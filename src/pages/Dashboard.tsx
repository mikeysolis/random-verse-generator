/**
 * Dashboard Page: The landing page for the users account related
 * information (subscription, payment, cards etc.). Uses Firebase
 * to lock it behind authorization.
 */

import { Suspense } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import { useUser, AuthCheck } from 'reactfire';

import Checkout from '../components/Checkout';
import { SignIn, SignOut } from '../components/Customers';
import Portal from '../components/Portal';

const Account: React.FC = () => {
  const user = useUser();
  return (
    <IonPage>
      <IonContent color="secondary">
        <div className="container">
          <Suspense fallback={'loading user...'}>
            <AuthCheck fallback={<SignIn />}>
              <p>Hello {user.data && user.data.displayName}</p>
              <Checkout />
              <SignOut user={user} />
              <Portal />
            </AuthCheck>
          </Suspense>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Account;
