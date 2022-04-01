import React from 'react';

// we're importing the useQuery Hook from Apollo Client. This will allow us 
// to make requests to the GraphQL server we connected to and made available 
// to the application using the <ApolloProvider> component in App.js earlier.
import { useQuery } from '@apollo/client';
// We also imported the QUERY_THOUGHTS query we just created in 
// utils/queries.js. Now we just need to use the query with the imported 
// Hook functionality, and we'll be able to query thought data!
// we can also import a query to include basic info on the user,
// which will include the user's friend list, which we will also use.
import { QUERY_THOUGHTS, QUERY_ME_BASIC } from '../utils/queries';

// see utils/auth.js
import Auth from '../utils/auth';

// if the user is logged in, we will render their friends list on the homepage
import FriendList from '../components/FriendList';

import ThoughtList from '../components/ThoughtList';

const Home = () => {

  // use Auth class to check if user is logged in with active JWT.
  const loggedIn = Auth.loggedIn();

  // use useQuery hook to make query request.
  // When we load the Home component in the application, we'll execute the 
  // query for the thought data. Because this is asynchronous, just like 
  // using fetch(), Apollo's @apollo/client library provides a loading property 
  // to indicate that the request isn't done just yet. When it's finished and we have 
  // data returned from the server, that information is stored in the destructured data property.
  // Working with Promise-based functionality in React can get cumbersome. But with the 
  // loading property, we'll be able to conditionally render data based on whether or not 
  // there is data to even display.
  const { loading, data } = useQuery(QUERY_THOUGHTS);

  // use object destructuring to extract `data` from the `useQuery` Hook's response 
  // and rename it `userData` to be more descriptive.
  // Now if the user is logged in and has a valid token, userData will hold 
  // all of the returned information from our query. Let's take that data and load 
  // it in the <FriendList> component.
  const { data: userData } = useQuery(QUERY_ME_BASIC);

  // Next we'll get the thought data out of the query's response, because every GraphQL 
  // response comes in a big data object. In this case, we'll need to access data.thoughts. 
  // So what's this weird syntax? This is called optional chaining, and it's new to 
  // JavaScript—so new that only browsers seem to support it. If we tried to use it 
  // in a Node server, we'd receive a syntax error, because Node doesn't know what it is yet.
  // Optional chaining negates the need to check if an object even exists before accessing 
  // its properties. In this case, no data will exist until the query to the server is finished.
  // What we're saying is, if data exists, store it in the thoughts constant we just created. 
  // If data is undefined, then save an empty array to the thoughts component. Since this is React,
  // once the data exists the variable will update automatically and the thought list will render.
  const thoughts = data?.thoughts || [];
  console.log(thoughts);


  return (
    <main>
      <div className="flex-row justify-space-between">
        {/* With this in place, we're conditionally defining the layout for this <div>. If the 
        user isn't logged in, it'll span the full width of the row. But if you the user is 
        logged in, it'll only span eight columns, leaving space for a four-column <div> on the 
        righthand side. */}
        <div className={`col-12 mb-3 ${loggedIn && 'col-lg-8'}`}>
          {/* With this, we use a ternary operator to conditionally render the <ThoughtList> 
          component. If the query hasn't completed and loading is still defined, we display 
          a message to indicate just that. Once the query is complete and loading is 
          undefined, we pass the thoughts array and a custom title to the <ThoughtList> 
          component as props. */}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <ThoughtList thoughts={thoughts} title="Some Feed for Thought(s)..." />
          )}
        </div>
        {/* if user is logged in and the user's data was returned.
        // render the user's frienlist to the homepage */}
        {loggedIn && userData ? (
          <div className="col-12 col-lg-3 mb-3">
            <FriendList
              username={userData.me.username}
              friendCount={userData.me.friendCount}
              friends={userData.me.friends}
            />
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default Home;
