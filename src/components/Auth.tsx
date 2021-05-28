/**
 * Components involved in customer authentication with firebase.
 * Subscribed
 * SignIn
 * SingOut
 */

import { IonButton } from '@ionic/react';

import './Auth.css';
import { useContext } from '../lib/user/context';
import { auth, firestore, googleAuthProvider } from '../lib/firebase/config';

// Component to verify if the logged in user has an ACTIVE subscription.
// Must be run from within an AuthCheck component
interface SubscribeCheckProps {
  fallback?: React.ReactNode;
}

export const SubscribeCheck: React.FC<SubscribeCheckProps> = ({
  fallback,
  children,
}) => {
  // Grab the current user
  const { status } = useContext();

  // If the user status is ACTIVE or PAST_DUE allow access, else not.
  return (
    <>{status === 'ACTIVE' || status === 'PAST_DUE' ? children : fallback}</>
  );
};

// SignIn Button for Google
export const SignInWithGoogle: React.FC = () => {
  const signIn = async () => {
    const credential = await auth.signInWithPopup(googleAuthProvider);

    const { uid, email } = credential.user!;

    const batch = firestore.batch();

    const userRef = firestore.collection('users').doc(uid);
    batch.set(
      userRef,
      { email, roles: ['user'], status: 'INACTIVE' },
      { merge: true }
    );

    const categoryRef = firestore
      .collection('users')
      .doc(uid)
      .collection('categories')
      .doc('uncategorized');
    batch.set(
      categoryRef,
      {
        id: 'uncategorized',
        name: 'uncategorized',
        count: 0,
      },
      { merge: true }
    );

    await batch.commit();
  };

  return <button onClick={signIn} className="google-login-button" />;
};

// Signout Button

export const SignOut: React.FC = () => {
  return (
    <IonButton
      onClick={() => auth.signOut()}
      className="ion-text-uppercase ion-margin-bottom"
      color="warning"
      expand="full"
    >
      Sign Out
    </IonButton>
  );
};
