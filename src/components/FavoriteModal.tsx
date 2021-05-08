/**
 * Component: FavoriteModal
 * Dedicated component for the modal window that pops up
 * when the user presses the Favorites button on a verse
 */

import { IonButton } from '@ionic/react';

import { Verse } from '../lib/store/types';

interface FavoriteModalProps {
  verse: Verse;
  onDismiss: () => void;
}

const FavoriteModal: React.FC<FavoriteModalProps> = ({ verse, onDismiss }) => {
  return (
    <>
      <p>{verse.verseTitle}</p>
      <IonButton expand="full" onClick={() => onDismiss()}>
        Close
      </IonButton>
    </>
  );
};

export default FavoriteModal;
