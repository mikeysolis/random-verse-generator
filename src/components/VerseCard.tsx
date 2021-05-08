/**
 * Component: VerseCard
 * Displays an actual verse of scripture in a pretty IonCard format.
 * Allows users to bookmark verses.
 */

import {
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonFabButton,
} from '@ionic/react';
import { bookmark, trash, heart } from 'ionicons/icons';

import './VerseCard.css';
import { Verse } from '../lib/store/types';

/**
 * The VerseCard takes multiple props:
 * verse: the actually verse from the scripture API
 * isBookmarked: whether the verse has been bookmarked
 * onBookmarkDeletedClickHandler: allows for deletion of a bookmark
 * onFavoriteClickHandler: opens the FavoriteModal
 * isVerseForMenu: if the verse is displayed on the menu, show a trash can icon
 * instead of bookmark icon.
 */
interface VerseCardProps {
  verse: Verse;
  isBookmarked: boolean | null;
  onBookmarkDeleteClickHandler: (verse: Verse) => void;
  onFavoriteClickHandler: (verse: Verse) => void;
  isVerseForMenu: boolean;
}

const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  isBookmarked,
  onBookmarkDeleteClickHandler,
  onFavoriteClickHandler,
  isVerseForMenu,
}) => {
  return (
    <>
      <IonCard color="primary">
        <IonCardHeader>
          <IonCardTitle className="home-ion-card-title">
            {verse.verseTitle}
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent className="home-ion-card-content">
          {verse.scriptureText}
        </IonCardContent>
      </IonCard>
      <div className="card-button-container">
        <IonFabButton
          size="small"
          color="light"
          className="verse-option-button"
          onClick={() => onBookmarkDeleteClickHandler(verse)}
        >
          {isVerseForMenu ? (
            <IonIcon className="verse-option-icon" icon={trash} />
          ) : (
            <IonIcon
              className={`verse-option-icon${isBookmarked ? ' active' : ''}`}
              icon={isVerseForMenu ? trash : bookmark}
            />
          )}
        </IonFabButton>
        <IonFabButton
          size="small"
          color="light"
          className="verse-favorite-button"
          onClick={() => onFavoriteClickHandler(verse)}
        >
          <IonIcon className="verse-favorite-icon" icon={heart} />
        </IonFabButton>
      </div>
    </>
  );
};

export default VerseCard;
