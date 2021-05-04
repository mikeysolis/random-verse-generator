/**
 * Basic config for the app. Easily to change these names here
 * in one place as the change somewhat frequently during development.
 */

const CURRENCY = 'usd';
const STRIPE_API = process.env.REACT_APP_STRIPE_API_URL;
const SCRIPTURE_API = process.env.REACT_APP_SCRIPTURE_API_URL;
const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY;

export { CURRENCY, STRIPE_API, SCRIPTURE_API, STRIPE_PUBLIC_KEY };
