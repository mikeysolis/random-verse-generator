/**
 * Simple component that displays a pretty looking set up
 * skeleton cards while the verses are loading the the API.
 */

import {
  IonSkeletonText,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
  IonFabButton,
} from '@ionic/react';

import './SkeletonCards.css';

// Number of desired card.
const NUMBER_OF_CARDS = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

// Loop through and display the assigned number of cards.
const SkeletonCards: React.FC = () => (
  <>
    {NUMBER_OF_CARDS.map(card => (
      <Card key={card.id} />
    ))}
  </>
);

// A single card
const Card: React.FC = () => (
  <>
    <IonCard className="custom-skeleton verse-card" color="primary">
      <IonCardHeader>
        <IonCardTitle className="skeleton-verse-title">
          <IonSkeletonText animated />
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent className="verse">
        <IonSkeletonText animated />
        <IonSkeletonText animated />
        <IonSkeletonText animated />
        <IonSkeletonText animated />
      </IonCardContent>
    </IonCard>
    <div className="card-button-container">
      <IonFabButton
        size="small"
        color="primary"
        className="verse-option-button"
      />
    </div>
  </>
);

export default SkeletonCards;
