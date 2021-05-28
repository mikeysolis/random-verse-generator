/**
 * Components related to handling the Stripe Checkout Session.
 */

import { useStripe } from '@stripe/react-stripe-js';
import {
  IonContent,
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
} from '@ionic/react';

import AuthCheck from '../components/AuthCheck';
import { fetchFromAPI } from '../lib/utils/helpers';
import { LoggedIn, LoggedOut } from '../pages/Dashboard';
import { PrettyCard } from '../components/Cards';

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
    <IonButton
      className="ion-text-uppercase ion-margin-bottom"
      color="warning"
      expand="full"
      onClick={() => handleClick('price_1In7IfGxkUd0sje6Is2cWQne')}
    >
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
  // const url = window.location.href;
  // const sessionId = new URL(url).searchParams.get('session_id');

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Success!</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding-top">
        <PrettyCard title="Subscription Completed">
          Thank you for joining our family! You now have access to the entire
          suite of Scripture Study Apps and all available features!
        </PrettyCard>
        <AuthCheck fallback={<LoggedOut />}>
          <LoggedIn />
        </AuthCheck>
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
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Canceled</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding-top">
        <PrettyCard title="Subscription Signup Canceled">
          It looks like you may have canceled the subscription process. That's
          okay, we understand and are looking forward to you joining our family
          in the future!
        </PrettyCard>
        <AuthCheck fallback={<LoggedOut />}>
          <LoggedIn />
        </AuthCheck>
      </IonContent>
    </IonPage>
  );
}
