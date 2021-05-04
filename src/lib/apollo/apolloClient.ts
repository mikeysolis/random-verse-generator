import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';

// Grab the script api base url from config
import { SCRIPTURE_API } from '../config';

// Setup config vars for apollo client
const httpLink = new HttpLink({
  uri: SCRIPTURE_API,
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
