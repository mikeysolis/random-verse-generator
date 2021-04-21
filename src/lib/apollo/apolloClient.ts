import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

// Setup config vars for apollo client
const BASE_URL = process.env.REACT_APP_HASURA_BASE_URL;
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
