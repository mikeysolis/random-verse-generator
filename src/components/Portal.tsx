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

  return <IonButton onClick={handleClick}>Manage Billing</IonButton>;
};

export default Portal;
