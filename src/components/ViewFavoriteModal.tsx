/**
 * Component: ViewFavoriteModal
 * Dedicated component for the modal window that pops up
 * when the user presses the View Favorite button
 */

import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { close } from 'ionicons/icons';

import './ViewFavoriteModal.css';
import { Favorite } from '../lib/types';

/**
 * Main display component, recieves neccessary props for the modal to function.
 * ie. the current user if exists, the verse to add and the handlers, one to handle
 * dismissing the modal and the second to add the verse to firebase.
 */
interface ViewFavoriteModalProps {
  favorite: Favorite;
  onDismiss: () => void;
}

const ViewFavoriteModal: React.FC<ViewFavoriteModalProps> = ({
  favorite,
  onDismiss,
}) => {
  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>View Favorite</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => onDismiss()}>
              <IonIcon size="large" icon={close} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <LoggedIn favorite={favorite} onDismiss={onDismiss} />
      </IonContent>
    </>
  );
};

// Content to display if the user is logged in

const LoggedIn: React.FC<ViewFavoriteModalProps> = ({
  favorite,
  onDismiss,
}) => {
  return (
    <div className="view-favorite-card-container">
      <div>
        <Card title={favorite.verseTitle!}>
          <p>{favorite.scriptureText}</p>
        </Card>
        {favorite.note && (
          <Card title="Personal Note">
            <p>{favorite.note}</p>
          </Card>
        )}
      </div>

      <IonCard className="ion-no-padding ion-padding-top ion-padding-start ion-padding-end">
        <IonButton
          className="ion-text-uppercase ion-margin-bottom"
          color="warning"
          expand="full"
          onClick={onDismiss}
        >
          Close
        </IonButton>
      </IonCard>
    </div>
  );
};

const Card: React.FC<{ title: string }> = ({ title, children }) => {
  return (
    <IonCard className="ion-no-padding ion-padding-top ion-padding-start ion-padding-end">
      <IonCardSubtitle color="primary">
        <h5>{title}</h5>
      </IonCardSubtitle>
      <IonCardContent className="ion-no-padding ion-padding-top ion-padding-bottom">
        {children}
      </IonCardContent>
    </IonCard>
  );
};

export default ViewFavoriteModal;
