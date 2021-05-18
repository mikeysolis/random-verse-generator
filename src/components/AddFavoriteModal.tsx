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
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonToast,
} from '@ionic/react';
import { close } from 'ionicons/icons';
import firebase from 'firebase/app';
import { addFavorite } from '../lib/firebase/db';

import './AddFavoriteModal.css';
import { Verse, Favorite, Category } from '../lib/store/types';

/**
 * Main display component, recieves neccessary props for the modal to function.
 * ie. the current user if exists, the verse to add and the handlers, one to handle
 * dismissing the modal and the second to add the verse to firebase.
 */
interface FavoriteModalProps {
  user: firebase.User;
  verse: Verse;
  categories: Category[];
  onDismiss: () => void;
}

const FavoriteModal: React.FC<FavoriteModalProps> = ({
  user,
  verse,
  categories,
  onDismiss,
}) => {
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
            user={user}
            verse={verse}
            categories={categories}
            onDismiss={onDismiss}
          />
        ) : (
          <LoggedOut />
        )}
      </IonContent>
    </>
  );
};

// Content to display if the user is logged in

const LoggedIn: React.FC<FavoriteModalProps> = ({
  user,
  verse,
  categories,
  onDismiss,
}) => {
  // Set up the IonToast to alert user if favorite has been successfully added
  const [presentToast, dismissToast] = useIonToast();
  // Setup the state for handling the Note textfield
  const [noteText, setNoteText] = useState<string>('');
  // State for handling the Category select input
  const [categoryId, setCategoryId] = useState<string>('uncategorized');

  // Handler for adding the verse to firebase
  const onClickAddFavoriteHandler = async () => {
    // Create favorites object
    const favorite: Favorite = {
      verseTitle: verse.verseTitle,
      verseId: verse.verseId,
      volumeTitle: verse.volumeTitle,
      scriptureText: verse.scriptureText,
      categoryId,
    };

    if (noteText !== '') favorite.note = noteText;

    // Add verse to firebase
    try {
      await addFavorite(user.uid, verse.verseTitle, favorite);
      presentToast({
        buttons: [{ text: 'close', handler: () => dismissToast() }],
        message: 'Favorite successfully added.',
        duration: 2000,
        color: 'dark',
      });
    } catch (error) {
      console.log(error);
    }

    onDismiss();
  };

  return (
    <div className="add-favorite-card-container">
      <div>
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
        <Card title="Category">
          <IonText>
            <p>Organize your new favorite into a category.</p>
          </IonText>
          <IonSelect
            title="Categories"
            value={categoryId}
            okText="Select"
            cancelText="Dismiss"
            onIonChange={e => setCategoryId(e.detail.value)}
            className="ion-text-capitalize"
          >
            {categories &&
              categories.map(category => (
                <IonSelectOption
                  key={category.id}
                  value={category.id}
                  className="ion-text-capitalize"
                >
                  <IonText>{category.name}</IonText>
                </IonSelectOption>
              ))}
          </IonSelect>
        </Card>
      </div>
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
    </div>
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
