import React from 'react';

// see google docs, MERN Stack Notes, Install and Set Up Apollo Client to have server communicate with React Front end
// So we just imported a few key pieces to the application—let's explain what each 
// will accomplish for us:
// ApolloProvider is a special type of React component that we'll use to 
// provide data to all of the other components.Provider components are not unique to 
// Apollo. In fact, Apollo Provider is just a specialized use case of a built-in React tool.
// ApolloClient is a constructor function that will help initialize the connection to 
// the GraphQL API server.
// InMemoryCache enables the Apollo Client instance to cache API response data 
// so that we can perform requests more efficiently.
// createHttpLink allows us to control how the Apollo Client makes a request. 
// Think of it like middleware for the outbound network requests.
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';


import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';


// With the code below, we first establish a new link to the GraphQL server at its /graphql 
// endpoint with createHttpLink(). We could pass many other options and configuration settings 
// into this function as well.
const httpLink = createHttpLink({
  // The React environment runs 
  // at localhost:3000, and the server environment runs at localhost:3001. So if we just 
  // used /graphql, as we've done previously, the requests would go to 
  // localhost:3000/graphql—which isn't the address for the back-end server, 3000 is the 
  // address for React's environment.
  // to fix this we added a proxy to the client folder's package.json.
  // "proxy": "http://localhost:3001",
  // With this proxy value in place, the Create React App team set up the development server 
  // to prefix all HTTP requests using relative paths (e.g., /graphql 
  // instead of http://localhost:3001/graphql)
  uri: '/graphql',
});

// After we create the link, we use the ApolloClient() constructor to instantiate the Apollo 
// Client instance and create the connection to the API endpoint.
const client = new ApolloClient({
  link: httpLink,
  // We also instantiate a new cache object using new InMemoryCache(). We could customize 
  // this to the application, but by default, it works well for this purpose.
  cache: new InMemoryCache(),
});

function App() {
  return (
    // Lastly, we need to enable our entire application to interact with our Apollo 
    // Client instance created above so that we can make api requests from the front
    // end.
    // Note how we wrap the entire returning JSX code with <ApolloProvider>. Because we're 
    // passing the client variable in as the value for the client prop in the provider, 
    // everything between the JSX tags will eventually have access to the server's API data 
    // through the client we set up.Note how we wrap the entire returning JSX code with 
    // <ApolloProvider>. Because we're passing the client variable in as the value for the 
    // client prop in the provider, everything between the JSX tags will eventually have 
    // access to the server's API data through the client we set up.
    <ApolloProvider client={client}>
      <div className="flex-column justify-flex-start min-100-vh">
        <Header />
        <div className="container">
          <Home />
        </div>
        <Footer />
      </div>
    </ApolloProvider>
  );
}

export default App;
