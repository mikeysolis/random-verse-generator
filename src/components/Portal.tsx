/**
 * Button that initiates a Stripe Portal Session for the user
 * to manage their subscription, payment methods etc.
 */

import { IonButton } from '@ionic/react';

import { fetchFromAPI } from '../lib/utils/helpers';

const Portal: React.FC = () => {
  const handleClick = async () => {
    const { url } = await fetchFromAPI('portal', {
      body: null,
      method: 'POST',
    });

    if (url) {
      window.location.href = url;
    }
  };

  return (
    <IonButton
      className="ion-text-uppercase ion-margin-bottom"
      color="warning"
      expand="full"
      onClick={handleClick}
    >
      Manage Subscription
    </IonButton>
  );
};

export default Portal;
