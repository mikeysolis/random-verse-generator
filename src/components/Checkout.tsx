/**
 * Components related to handling the Stripe Checkout Session.
 */

import { useStripe } from '@stripe/react-stripe-js';
import { IonButton, IonPage, IonContent } from '@ionic/react';

import { fetchFromAPI } from '../lib/utils/helpers';

/**
 * Component: Checkout
 * Displays the Subscribe button. The Subscribe button hits our Stripe
 * API and triggers a Stripe Checkout Session.
 */
export default function Checkout() {
  const stripe = useStripe();

  const handleClick = async (priceId: string) => {
    const { id: sessionId } = await fetchFromAPI('checkouts', {
      body: {
        priceId,
      },
      method: 'POST',
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

  return (
    <IonButton onClick={() => handleClick('price_1In7IfGxkUd0sje6Is2cWQne')}>
      Subscribe
    </IonButton>
  );
}

/**
 * Component: CheckoutSuccess
 * The success page displayed to the user after being
 * redirected from a success stripe checkout session.
 * Probably relocate this to its own component at a later date.
 */
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

/**
 * Component: CheckoutFailed
 * The cancel page displayed to the user after an unccessful
 * attempt at a Stripe Checkout Session
 */
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
