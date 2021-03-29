import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

function createApolloClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'https://lds-scripture-api.herokuapp.com/v1/graphql',
    }),
    cache: new InMemoryCache(),
  });
}

export default createApolloClient;
