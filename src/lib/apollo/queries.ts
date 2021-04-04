import { gql } from '@apollo/client';

const GET_RANDOM_VERSES_FROM_VOLUME = gql`
  query RandomVersesFromVolume($limit: Int!, $volumeId: Int!) {
    get_random_verses_from_volume(
      args: { _limit: $limit, _volume_id: $volumeId }
    ) {
      volumeTitle
      verseTitle
      scriptureText
      verseId
    }
  }
`;

export { GET_RANDOM_VERSES_FROM_VOLUME };
