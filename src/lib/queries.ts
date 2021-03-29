import { gql } from '@apollo/client';

const GET_RANDOM_VERSES = gql`
  query RandomVersesFromVolume($limit: Int!, $volumeId: Int!) {
    get_random_verses(args: { _limit: $limit, _volume_id: $volumeId }) {
      volumeTitle
      verseTitle
      scriptureText
      verseId
    }
  }
`;

export { GET_RANDOM_VERSES };
