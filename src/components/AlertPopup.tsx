/**
 * Component: AlertPopup
 * Reusable IonAlert component. Currently in use with the
 * clear bookmarks button and service worker for updating the app.
 */

import { IonAlert } from '@ionic/react';

import './AlertPopup.css';

interface AlertProps {
  showAlert: boolean;
  setShowAlert: React.Dispatch<React.SetStateAction<boolean>>;
  actionHandler?: (event?: any) => void;
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
            if (actionHandler) actionHandler();
          },
        },
      ]}
    />
  );
};

export default AlertPopup;
