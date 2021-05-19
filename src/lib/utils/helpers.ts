import { auth } from '../firebase/config';
import { STRIPE_API } from '../config';

import { Verse } from '../store/types';

/**
 * Determine if a verse card is currently bookmarked,
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
 * Fetch data from our Stripe API, set the body
 * and headers, return json. Adds the authorization
 * token.
 */

const fetchFromAPI = async (
  endpointURL: string,
  opts: { body: any; method: string } = { body: null, method: 'POST' }
) => {
  const { method, body } = { ...opts };

  const user = auth.currentUser;
  const token = user && (await user.getIdToken());

  const res = await fetch(`${STRIPE_API}/${endpointURL}`, {
    method,
    ...(body && { body: JSON.stringify(body) }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.json();
};

export { isBookmarked, fetchFromAPI };
