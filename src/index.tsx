import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import App from './App';
import { ContextProvider } from './lib/user/context';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import store from './lib/store/store';
import { swUpdate, swInit } from './lib/store/swSlice';
import { STRIPE_PUBLIC_KEY } from './lib/config';

export const stripePromise = loadStripe(
  STRIPE_PUBLIC_KEY || 'no stripe public key found'
);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </ContextProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// Use the service worker to detect updates. When updated dispatch
// an action to alert the user of the update and enable them to update.
serviceWorkerRegistration.register({
  onSuccess: () => store.dispatch(swInit()),
  onUpdate: reg => store.dispatch(swUpdate(reg)),
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
