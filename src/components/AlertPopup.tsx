import { IonAlert } from '@ionic/react';

import './AlertPopup.css';

interface AlertProps {
  showAlert: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  actionHandler: () => void;
  header: string;
  message: string;
}

const AlertPopup: React.FC<AlertProps> = ({
  showAlert,
  setShowAlert,
  actionHandler,
  header,
  message,
}) => {
  return (
    <IonAlert
      cssClass="alert-popup"
      isOpen={showAlert}
      onDidDismiss={() => setShowAlert(false)}
      header={header}
      message={message}
      buttons={[
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            setShowAlert(false);
          },
        },
        {
          text: 'OK',
          handler: () => {
            setShowAlert(false);
            actionHandler();
          },
        },
      ]}
    />
  );
};

export default AlertPopup;
