/**
 * Dashboard Page: The landing page for the users account related
 * information (subscription, payment, cards etc.). Uses Firebase
 * to lock it behind authorization.
 */

import { Suspense } from 'react';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
} from '@ionic/react';
import {
  useUser,
  useFirestore,
  useFirestoreDocData,
  AuthCheck,
} from 'reactfire';
import { ErrorBoundary } from 'react-error-boundary';

import Checkout from '../components/Checkout';
import {
  SignInWithGoogle,
  SignOut,
  SubscribeCheck,
} from '../components/Customers';
import Portal from '../components/Portal';
import LoadingSpinner from '../components/LoadingSpinner';
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
        <Suspense fallback={<LoadingSpinner />}>
          <AuthCheck fallback={<LoggedOut />}>
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <LoggedIn />
            </ErrorBoundary>
          </AuthCheck>
        </Suspense>
      </IonContent>
    </IonPage>
  );
};

// Show to the user if they are logged in
export const LoggedIn: React.FC = () => {
  // Grab the current user
  const { data: user } = useUser();

  // Retrieve the users Document Ref from firebase
  const userDetailsRef = useFirestore().collection('users').doc(user.uid);
  // Subscribe to the status field on the user Document
  const {
    data: { status },
  } = useFirestoreDocData<{ status: string }>(userDetailsRef);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
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
    </ErrorBoundary>
  );
};

// Show to the user if they are logged out
export const LoggedOut: React.FC = ({ children }) => {
  return (
    <div className="container">
      <BasicCard title="Sign In / Sign Up" button={<SignInWithGoogle />}>
        To become a free member, or manage your subscription, please sign in
        with your preferred provider.
      </BasicCard>
    </div>
  );
};

const ErrorFallback: React.FC<{ error: any; resetErrorBoundary: any }> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
};

export default Account;
