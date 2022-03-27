import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

// Setup config vars for apollo client
const BASE_URL = 'https://lds-scripture-api.herokuapp.com/v1/graphql';
const httpLink = new HttpLink({
  uri: BASE_URL,
});
const cache = new InMemoryCache();

// Function to init creation of apollo client
function createApolloClient() {
  return new ApolloClient({
    link: httpLink,
    cache,
  });
}

export default createApolloClient;
