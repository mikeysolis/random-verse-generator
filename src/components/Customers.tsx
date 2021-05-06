/**
 * Components involved in customer authentication with firebase.
 * Subscribed
 * SignIn
 * SingOut
 */

import firebase from 'firebase/app';
import { useUser, useFirestore, useFirestoreDocData } from 'reactfire';
import { IonButton } from '@ionic/react';

import { auth, db } from '../lib/firebase/config';

// Component to verify if the logged in user has an ACTIVE subscription
export const SubscribeCheck: React.FC = ({ children }) => {
  // Grab the current user
  const { data: user } = useUser();
  // Retrieve the users Document Ref from firebase
  const userDetailsRef = useFirestore().collection('users').doc(user.uid);
  // Subscribe to the status field on the user Document
  const {
    data: { status },
  } = useFirestoreDocData<{ status: string }>(userDetailsRef);

  // If the user status is ACTIVE or PAST_DUE allow access, else not.
  return (
    <>
      {status === 'ACTIVE' || status === 'PAST_DUE' ? (
        children
      ) : (
        <p>Must be subscribed to use this feature</p>
      )}
    </>
  );
};

// SignIn Button for Google
export const SignIn: React.FC = () => {
  const signIn = async () => {
    const credential = await auth.signInWithPopup(
      new firebase.auth.GoogleAuthProvider()
    );

    const { uid, email } = credential.user!;
    db.collection('users').doc(uid).set({ email }, { merge: true });
  };

  return <IonButton onClick={signIn}>Sign In with Google</IonButton>;
};

// Signout Button
interface SignOutProps {
  user: any;
}

export const SignOut: React.FC<SignOutProps> = ({ user }) => {
  return (
    user && (
      <IonButton onClick={() => auth.signOut()}>
        Sign Out User {user.uid}
      </IonButton>
    )
  );
};
