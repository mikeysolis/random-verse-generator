import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://api.scripturestudyapps.com/v1/graphql',
    }),
    cache: new InMemoryCache(),
  });
}

export default createApolloClient;
