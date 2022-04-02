import React from 'react';

// see google docs, MERN Stack Notes, Install and Set Up Apollo Client to have server communicate with 
// React Front end
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

// The last thing we need to do is instruct the Apollo instance in App.js to 
// retrieve the token stored in local storage every time we make a GraphQL 
// request. We'll need to import another function from Apollo Client that will retrieve 
// the token from localStorage and include it with each request to the API. We set the 
// JWT auth token in utils/auth.js. It is set whenever a user logs in, they receive a json web token
// that is stored in their localStorage.
import { setContext } from '@apollo/client/link/context';


// see google docs, MERN Stack Notes, Set Up the Main URL Routes Using React Router.
// Enables us to use client side routing. Which means that when a user clicks on certain
// components, react will allow certain behaviors such as change the URL so different 
// components can be bookmarked or pass information into the URL. All while still
// maintaining the same fnctionality of a regular single page application (SPA).
// With React Router, you can use another component from the library called 
// Switch that will allow you to set a catch-all route that will display a 404
// page, for example, when a user requests a URL that is not defined.
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';

import Home from './pages/Home';
import Login from './pages/Login';
import NoMatch from './pages/NoMatch';
import SingleThought from './pages/SingleThought';
import Profile from './pages/Profile';
import Signup from './pages/Signup';


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

// With the function setContext above from the apollo client, we can create 
// essentially a middleware function that will retrieve the token for us and combine 
// it with the existing httpLink.
// When we need to use a specific function that a library provides us, we might 
// not need to use every parameter for that function. Often, we can't omit an unused 
// parameter, because the function is looking for these parameters in a specific 
// order. In this case, we don't need the first parameter offered by setContext(), 
// which stores the current request object in case this function is running after 
// we've initiated a request.
// Because we're not using the first parameter, but we still need to access 
// the second one, we can use an underscore _ to serve as a placeholder 
// for the first parameter.
// With the configuration of authLink, we use the setContext() function to 
// retrieve the token from localStorage and set the HTTP request headers of 
// every request to include the token, whether the request needs it or not. This 
// is fine, because if the request doesn't need the token, our server-side resolver 
// function won't check for it.
// we check for header authorization in the resolver using the "context" object.
// Now that this is in place, we won't have to worry about doing this manually 
// with every single request. It'll just do it for us!
// Any time we make a request to the server, we use the code we just implemented 
// to automatically set the HTTP request headers with our token. This way, our 
// server can receive the request, check the token's validity, and allow us to 
// continue our request if it is.
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    // set the header object to have all the other headers, and then add
    // an authorization header
    headers: {
      ...headers,
      // if there is a token, set authorization header to bearer <token>,
      // else set the authorization to an empty string.
      // Any time we make a request to the server, we use the code we just implemented 
      // to automatically set the HTTP request headers with our token. This way, our 
      // server can receive the request, check the token's validity, and allow us to 
      // continue our request if it is.
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// After we create the link, we use the ApolloClient() constructor to instantiate the Apollo 
// Client instance and create the connection to the API endpoint.
const client = new ApolloClient({
  // Finally, we need to combine the authLink and httpLink objects so that every request 
  // retrieves the json web token and sets the request headers before making the 
  // request to the API.
  // Any time we make a request to the server, we use the code we just implemented a 
  // few moments ago to automatically set the HTTP request headers with our token. 
  // This way, our server can receive the request, check the token's validity since all 
  // requests are now set to have the authorization header, and allow us to 
  // continue our request if it is.
  link: authLink.concat(httpLink),
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
      {/* We've wrapped the <div className="flex-column"> element in a Router 
      component, which makes all of the child components on the page aware of the 
      client-side routing that can take place now. */}
      <Router>
        <div className="flex-column justify-flex-start min-100-vh">
          <Header />
          <div className="container">
            {/* With React Router, you can use another component from the library called 
            Switch that will allow you to set a catch-all route that will display a 404
            page, for example, when a user requests a URL that is not defined. */}
            <Switch>
              {/* we've set up several Route components that signify this part of the 
              app as the place where content will change according to the URL route. 
              When the route is /, the Home component will render here. When the route 
              is /login, the Login component will render. */}
              <Route exact path="/" component={Home} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/signup" component={Signup} />
              {/* the :username sets up the profile path to accept
              a parameter. This parameter would have the username of the desired
              user's profile.  
              The ? means this parameter is optional, so /profile and 
              /profile/myUsername will both render the Profile component. 
              Later on, we'll set up /profile to display the logged-in user's 
              information.*/}
              <Route exact path="/profile/:username?" component={Profile} />
              <Route exact path="/thought/:id" component={SingleThought} />

              {/* We've wrapped all of the Route components in a Switch component 
              and included one more Route at the end to render the NoMatch 
              component that we created. If the route doesn't match any of the 
              preceding paths (e.g., /about), then users will see the 404 message. */}
              <Route component={NoMatch} />
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
