import {
  IonSkeletonText,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonCardTitle,
} from '@ionic/react';

import './SkeletonCards.css';

const NUMBER_OF_CARDS = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

const SkeletonCards: React.FC = () => (
  <>
    {NUMBER_OF_CARDS.map(card => (
      <Card key={card.id} />
    ))}
  </>
);

const Card: React.FC = () => (
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
);

export default SkeletonCards;
