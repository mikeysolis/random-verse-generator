import { useStripe } from '@stripe/react-stripe-js';
import { IonButton, IonPage, IonContent } from '@ionic/react';

import { fetchFromAPI } from '../lib/utils/helpers';

export default function Checkout() {
  const stripe = useStripe();

  const product = {
    name: 'Bike',
    description: 'Shiny bike.',
    amount: 889999,
    currency: 'usd',
    quantity: 1,
  };

  const handleClick = async () => {
    const body = {
      line_items: [product],
    };
    const { id: sessionId } = await fetchFromAPI('checkouts', {
      body,
    });

    // This if is neccessary until react-stripe-js updates to the
    // latest builds of stripe-js.
    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        // If `redirectToCheckout` fails due to a browser or network
        // error, display the localized error message to your customer
        // using `result.error.message`.
        console.log(error);
      }
    }
  };

  return <IonButton onClick={handleClick}>Subscribe</IonButton>;
}

export function CheckoutSuccess() {
  const url = window.location.href;
  const sessionId = new URL(url).searchParams.get('session_id');

  return (
    <IonPage>
      <IonContent color="secondary">
        <div className="container">
          <p>Success page bro!</p>
          <p>Session ID: {sessionId}</p>
        </div>
      </IonContent>
    </IonPage>
  );
}

export function CheckoutFailed() {
  return (
    <IonPage>
      <IonContent color="secondary">
        <div className="container">
          <p>Failed page bro!</p>
        </div>
      </IonContent>
    </IonPage>
  );
}
