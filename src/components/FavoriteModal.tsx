/**
 * Component: FavoriteModal
 * Dedicated component for the modal window that pops up
 * when the user presses the Favorites button on a verse
 */

import React, { useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import firebase from 'firebase/app';
import { db } from '../lib/firebase/config';

import './FavoriteModal.css';
import { Verse } from '../lib/store/types';

/**
 * Main display component, recieves neccessary props for the modal to function.
 * ie. the current user if exists, the verse to add and the handlers, one to handle
 * dismissing the modal and the second to add the verse to firebase.
 */
interface FavoriteModalProps {
  user: firebase.User;
  verse: Verse;
  onDismiss: () => void;
}

type Favorite = {
  verseTitle: string;
  verseId: number;
  volumeTitle: string;
  scriptureText: string;
  note?: string;
};

const FavoriteModal: React.FC<FavoriteModalProps> = ({
  user,
  verse,
  onDismiss,
}) => {
  // Setup the state for handling the Note textfield
  const [noteText, setNoteText] = useState<string>('');

  // Handler for adding the verse to firebase
  const onClickAddFavoriteHandler = async () => {
    // Create favorites object
    const favorite: Favorite = {
      verseTitle: verse.verseTitle,
      verseId: verse.verseId,
      volumeTitle: verse.volumeTitle,
      scriptureText: verse.scriptureText,
    };

    if (noteText !== '') favorite.note = noteText;

    // Add verse to firebase
    try {
      await db
        .collection('users')
        .doc(user.uid)
        .collection('favorites')
        .doc(verse.verseTitle)
        .set(favorite, { merge: true });
    } catch (error) {
      console.log(error);
    }

    onDismiss();
  };

  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Add Favorite</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onDismiss()}>
              <IonIcon size="large" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {user ? (
          <LoggedIn
            onClickAddFavoriteHandler={onClickAddFavoriteHandler}
            verse={verse}
            noteText={noteText}
            setNoteText={setNoteText}
          />
        ) : (
          <LoggedOut />
        )}
      </IonContent>
    </>
  );
};

// Content to display if the user is logged in
interface LoggedInProps {
  onClickAddFavoriteHandler: () => void;
  verse: Verse;
  noteText: string;
  setNoteText: React.Dispatch<React.SetStateAction<string>>;
}

const LoggedIn: React.FC<LoggedInProps> = ({
  onClickAddFavoriteHandler,
  verse,
  noteText,
  setNoteText,
}) => {
  return (
    <>
      <Card title="Selected Verse">
        <IonText>
          <h2 className="ion-padding-bottom">{verse.verseTitle}</h2>
        </IonText>
        <IonText>
          <p>
            <TruncateVerse verse={verse} />
          </p>
        </IonText>
      </Card>
      <Card title="Personal Note">
        <IonText>
          <p>
            An optional note to help you remember why you wanted to make this
            verse a favorite.
          </p>
        </IonText>
        <IonTextarea
          className="ion-margin-top"
          autoGrow={true}
          enterkeyhint="done"
          inputmode="text"
          name="note"
          spellCheck="true"
          placeholder="Enter note..."
          value={noteText}
          onIonChange={e => setNoteText(e.detail.value!)}
        ></IonTextarea>
      </Card>
      <IonCard className="ion-no-padding ion-padding-top ion-padding-start ion-padding-end">
        <IonButton
          className="ion-text-uppercase ion-margin-bottom"
          color="warning"
          expand="full"
          onClick={onClickAddFavoriteHandler}
        >
          Add Favorite
        </IonButton>
      </IonCard>
    </>
  );
};

// Content to display is the user is logged out
const LoggedOut = () => {
  return (
    <>
      <Card title="Message">
        <IonText>
          <h2 className="ion-padding-bottom">Please Login</h2>
        </IonText>
        <p>
          In order to add favorite verses you must be logged in. If you don't
          want to log in that's okay, we recommend saving the verse as a
          Bookmark instead.
        </p>
        <br />
        <p>
          For your reference, Bookmarks are saved on your device. Deleting the
          app from your phone will delete bookmarks. Favorites are saved in the
          cloud and will not be deleted if you delete the app. They will always
          be there for you!
        </p>
      </Card>
    </>
  );
};

// Component to determine if the verse string has more than 150 characters,
// if so truncate it and add a 'reveal entire verse' toggle.
const TruncateVerse: React.FC<{ verse: Verse }> = ({ verse }) => {
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  if (verse.scriptureText.length > 150) {
    return isRevealed ? (
      <>
        {verse.scriptureText}
        <br />
        <button onClick={() => setIsRevealed(!isRevealed)}>
          hide full verse
        </button>
      </>
    ) : (
      <>
        {verse.scriptureText.substring(0, 150)} ... <br />
        <button onClick={() => setIsRevealed(!isRevealed)}>
          reveal full verse
        </button>
      </>
    );
  }

  return <>{verse.scriptureText}</>;
};

const Card: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <IonCard className="ion-no-padding ion-padding-top ion-padding-start ion-padding-end">
      <IonCardSubtitle color="primary">{title}</IonCardSubtitle>
      <IonCardContent className="ion-no-padding ion-padding-top ion-padding-bottom">
        {children}
      </IonCardContent>
    </IonCard>
  );
};

export default FavoriteModal;
