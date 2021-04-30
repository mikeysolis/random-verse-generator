import { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { IonButton } from '@ionic/react';

import { fetchFromAPI } from '../lib/utils/helpers';

function Payments() {
  const stripe = useStripe();
  const elements = useElements();

  const [amount, setAmount] = useState(85999);
  const [paymentIntent, setPaymentIntent] = useState({ status: 'initial' });

  // Hand the submission of card details
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Clamp amount to Stripe min/max
    const validAmount = Math.min(Math.max(amount, 50), 9999999);
    setAmount(validAmount);

    // Abort if the form isn't valid
    if (!e.currentTarget.reportValidity()) return;

    // Create a Payment Intent with the specified amount
    const pi = await fetchFromAPI('payments', {
      body: { amount: validAmount },
    });
    setPaymentIntent(pi);

    if (pi.statusCode === 500) {
      setPaymentIntent({ status: 'error' });
      return;
    }

    // Get a reference to a mounted CardElement. Elements knows how
    // to find your CardElement because there can only ever be one of
    // each type of element.
    const cardElement = elements!.getElement(CardElement);

    // Confirm Card Payment
    const {
      error,
      paymentIntent: updatedPaymentIntent,
    } = await stripe!.confirmCardPayment(pi.client_secret, {
      payment_method: {
        card: cardElement!,
      },
    });

    if (error) {
      console.error(error);
      error.payment_intent && setPaymentIntent(error.payment_intent);
    } else if (updatedPaymentIntent) {
      setPaymentIntent(updatedPaymentIntent);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <IonButton type="submit">Pay</IonButton>
    </form>
  );
}

export default Payments;
