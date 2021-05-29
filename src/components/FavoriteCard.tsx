/**
 * Component: FavoriteCard
 * Displays an actual Favorite verse of scripture in a pretty IonCard format.
 * Allows users to View or Edit the favorite.
 */

import { useState } from 'react';
import {
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonFabButton,
} from '@ionic/react';
import { eye, pencil, trash } from 'ionicons/icons';

import './VerseCard.css';
import { Favorite } from '../lib/types';
import AlertPopup from '../components/AlertPopup';

/**
 * The FavoriteCard takes multiple props:
 * favorite: the actually favorite from the scripture API
 * onEditFavoriteClickHandler: allows for editing a favorite verse
 * onDeleteFavoriteClickHandler: allows the deletion of a favorite
 */
interface FavoriteCardProps {
  favorite: Favorite;
  onEditFavoriteClickHandler: (favorite: Favorite) => void;
  onDeleteFavoriteClickHandler: (favorite: Favorite) => void;
  onViewFavoriteClickHandler: (favorite: Favorite) => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
  favorite,
  onEditFavoriteClickHandler,
  onDeleteFavoriteClickHandler,
  onViewFavoriteClickHandler,
}) => {
  // State to track if the user has pressed the delete button
  const [deleteFavoriteAlert, setDeleteFavoriteAlert] =
    useState<boolean>(false);

  return (
    <>
      <AlertPopup
        showAlert={deleteFavoriteAlert}
        setShowAlert={setDeleteFavoriteAlert}
        actionHandler={() => onDeleteFavoriteClickHandler(favorite)}
        header="Delete Favorite"
        message="Tap 'OK' to permanently delete this Favorite."
      />
      <IonCard color="secondary">
        <IonCardHeader>
          <IonCardTitle className="home-ion-card-title">
            {favorite.verseTitle}
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent className="home-ion-card-content">
          {favorite.scriptureText}
        </IonCardContent>
      </IonCard>
      <div className="card-button-container">
        <IonFabButton
          size="small"
          color="medium"
          className="verse-option-button"
          onClick={() => onViewFavoriteClickHandler(favorite)}
        >
          <IonIcon className="verse-option-icon" icon={eye} />
        </IonFabButton>
        <IonFabButton
          size="small"
          color="medium"
          className="verse-favorite-button"
          onClick={() => onEditFavoriteClickHandler(favorite)}
        >
          <IonIcon className="verse-favorite-icon" icon={pencil} />
        </IonFabButton>
        <IonFabButton
          size="small"
          color="medium"
          className="verse-option-button"
          onClick={() => setDeleteFavoriteAlert(true)}
        >
          <IonIcon className="verse-option-icon" icon={trash} />
        </IonFabButton>
      </div>
    </>
  );
};

export default FavoriteCard;
