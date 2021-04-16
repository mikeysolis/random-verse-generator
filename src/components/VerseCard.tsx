import {
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader,
  IonIcon,
  IonButton,
} from '@ionic/react';
import { bookmark } from 'ionicons/icons';

import './VerseCard.css';
import { Verse } from '../lib/store/types';

interface VerseCardProps {
  verse: Verse;
  isBookmarked: boolean;
  onBookmarkClickHandler: (verse: Verse) => void;
}

const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  isBookmarked,
  onBookmarkClickHandler,
}) => {
  return (
    <IonCard color="primary">
      <IonCardHeader>
        <IonCardTitle className="home-ion-card-title">
          {verse.verseTitle}
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="home-ion-card-content">
        {verse.scriptureText}
      </IonCardContent>
      <div className="card-button-container">
        <IonButton
          size="small"
          className="verse-option-button"
          fill="clear"
          onClick={() => onBookmarkClickHandler(verse)}
        >
          <IonIcon
            className={`verse-option-icon${isBookmarked ? ' active' : ''}`}
            icon={bookmark}
          />
        </IonButton>
      </div>
    </IonCard>
  );
};

export default VerseCard;
