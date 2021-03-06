import {
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonFabButton,
} from '@ionic/react';
import { bookmark, trash } from 'ionicons/icons';

import './VerseCard.css';
import { Verse } from '../lib/store/types';

interface VerseCardProps {
  verse: Verse;
  isBookmarked: boolean | null;
  onBookmarkDeleteClickHandler: (verse: Verse) => void;
  isVerseForMenu: boolean;
}

const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  isBookmarked,
  onBookmarkDeleteClickHandler,
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
      </div>
    </>
  );
};

export default VerseCard;
