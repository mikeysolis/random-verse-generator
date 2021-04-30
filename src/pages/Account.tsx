import { IonContent, IonPage } from '@ionic/react';

// import Checkout from '../components/Checkout';
import Payments from '../components/Payments';

const Account: React.FC = () => {
  return (
    <IonPage>
      <IonContent color="secondary">
        <div className="container">
          <Payments />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Account;
