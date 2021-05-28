/**
 * Dashboard Page: The landing page for the users account related
 * information (subscription, payment, cards etc.). Uses Firebase
 * to lock it behind authorization.
 */

import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';

import AuthCheck from '../components/AuthCheck';
import { useContext } from '../lib/user/context';
import Checkout from '../components/Checkout';
import { SignInWithGoogle, SignOut } from '../components/Customers';
import Portal from '../components/Portal';
import { PrettyCard, BasicCard } from '../components/Cards';

// The main content component for the Dashboard
const Account: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding-top">
        <AuthCheck fallback={<LoggedOut />}>
          <LoggedIn />
        </AuthCheck>
      </IonContent>
    </IonPage>
  );
};

// Show to the user if they are logged in
export const LoggedIn: React.FC = () => {
  const { status } = useContext();
  return (
    <>
      {status === 'ACTIVE' || status === 'PAST_DUE' ? (
        <PrettyCard title="Manage Subscription" button={<Portal />}>
          Easily manage your membership subscription. Add, update, and remove
          payment methods. Cancel or renew your subscription at anytime.
        </PrettyCard>
      ) : (
        <PrettyCard title="Subscribe" button={<Checkout />}>
          Become a member today and start saving your Favorite verses to the
          Cloud. They will always be available when you need them for talks,
          sermons, lessons and spiritual thoughts! Only .99 cents a month!
        </PrettyCard>
      )}
      <PrettyCard title="Logout" button={<SignOut />}>
        To access every feature we recommend you stay logged in but if you do
        need to logout, here is where you do that!
      </PrettyCard>
    </>
  );
};

// Show to the user if they are logged out
export const LoggedOut: React.FC = () => {
  return (
    <div className="container">
      <BasicCard title="Sign In / Sign Up" button={<SignInWithGoogle />}>
        To become a free member, or manage your subscription, please sign in
        with your preferred provider.
      </BasicCard>
    </div>
  );
};

export default Account;
