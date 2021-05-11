import { IonApp, IonContent, IonSpinner } from '@ionic/react';

const LoadingApp: React.FC = () => {
  return (
    <IonApp>
      <IonContent>
        <div className="container">
          <IonSpinner />
        </div>
      </IonContent>
    </IonApp>
  );
};

export default LoadingApp;
