import { Verse } from '../store/types';

/**
 * Determine is a verse card is currently bookmarked,
 * returns true or false.
 */
const isBookmarked = (verseId: number, bookmarks: Verse[]) => {
  const exists = bookmarks.findIndex(
    (bookmark: Verse) => bookmark.verseId === verseId
  );

  if (exists === -1) {
    return false;
  }

  return true;
};

/**
 * Fetch data from the Stripe API, set the body
 * and headers, return json.
 */
const API = 'http://localhost:3333';

const fetchFromAPI = async (
  endpointURL: string,
  opts: { body: any } = { body: null }
) => {
  const { method, body } = { method: 'POST', ...opts };
  const res = await fetch(`${API}/${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return res.json();
};

function formatAmountForDisplay(amount: number, currency: string): string {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  return numberFormat.format(amount);
}

function formatAmountForStripe(amount: number, currency: string): number {
  let numberFormat = new Intl.NumberFormat(['en-US'], {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol',
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency: boolean = true;
  for (let part of parts) {
    if (part.type === 'decimal') {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
}

export {
  isBookmarked,
  fetchFromAPI,
  formatAmountForDisplay,
  formatAmountForStripe,
};
