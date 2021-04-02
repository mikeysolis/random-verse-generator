import { IonSkeletonText } from '@ionic/react';

import './SkeletonVerse.css';

const SkeletonVerse: React.FC = () => {
  return (
    <div className="ion-padding custom-skeleton">
      <IonSkeletonText animated />
      <IonSkeletonText animated />
      <IonSkeletonText animated />
      <IonSkeletonText animated />
      <IonSkeletonText animated />
      <IonSkeletonText animated />
      <IonSkeletonText
        animated
        style={{ width: '35%' }}
        className="skeleton-verse-title"
      />
    </div>
  );
};

export default SkeletonVerse;
