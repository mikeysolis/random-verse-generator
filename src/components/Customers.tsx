/**
 * Components involved in customer authentication with firebase
 */

import firebase from 'firebase/app';
import { IonButton } from '@ionic/react';

import { auth, db } from '../lib/firebase/config';

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
