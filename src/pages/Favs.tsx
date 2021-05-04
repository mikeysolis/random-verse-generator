/**
 * Favs: Feature allowing the user to save and revisit favorite
 * scriptures.
 */

import { IonContent, IonPage } from '@ionic/react';

const Favs: React.FC = () => {
  return (
    <IonPage>
      <IonContent color="secondary">
        <div className="container">
          <p>My favs bro!</p>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Favs;
