// see google docs, MERN Stack Notes, Create ThoughtList Component

// As we saw earlier when we built the server, we'll use multiple GraphQL queries and 
// mutations with this application. Thus, we should probably separate all of the front-end 
// logic for these query and mutation requests into their own files. We'll end up with more readable code 
// and reusable queries in multiple spots.
// This file will store all of the GraphQL query requests.

import { gql } from '@apollo/client';

// We've used similar syntax from the test query we wrote using the GraphQL Playground 
// earlier. Now we've wrapped the entire query code in a tagged template literal using the 
// imported gql function. We've also saved it as QUERY_THOUGHTS and exported it using the ES6 
// module export syntax.
// And just like that, we can import this query function by name and use it anywhere we 
// need throughout the front end of the application. We'll do that next.
// capture the parameter $username that will be of the type String.
export const QUERY_THOUGHTS = gql`
  query thoughts($username: String) {
    thoughts(username: $username) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;

// query a single thoughts's information
// capture the parameter $id that will be of the type ID.
// exclamation mark ! means that the parameter is required to use 
// this query.
export const QUERY_THOUGHT = gql`
  query thought($id: ID!) {
    thought(_id: $id) {
      _id
      thoughtText
      createdAt
      username
      reactionCount
      reactions {
        _id
        createdAt
        username
        reactionBody
      }
    }
  }
`;

// get a single user's data for the profile page.
export const QUERY_USER = gql`
  query user($username: String!) {
    user(username: $username) {
      _id
      username
      email
      friendCount
      friends {
        _id
        username
      }
      thoughts {
        _id
        thoughtText
        createdAt
        reactionCount
      }
    }
  }
`;

// Because we now have the ability to persist a user's logged-in 
// status on the app, we can personalize and tailor the experience for 
// them a bit more. What we're going to do next is update the home and profile 
// pages to conditionally render data that's specific to the logged-in user.
// To do so, we'll have to create a couple of queries to retrieve that data. 
// Let's go ahead and do that now.
// Did you notice that this query doesn't have the same syntax as the other queries? 
// Because we aren't passing any variables to it, we can simply name the query, and 
// GraphQL will handle the rest.
// With this query, we're going to retrieve essentially all data related to the 
// logged-in user. We'll retrieve their user information, thoughts, reactions to 
// those thoughts, and friend list. This one will be great for the user's personal 
// profile page, but we don't really need this much for the homepage, so let's create 
// one more using the me query that returns less data.
export const QUERY_ME = gql`
  {
    me {
      _id
      username
      email
      friendCount
      thoughts {
        _id
        thoughtText
        createdAt
        reactionCount
        reactions {
          _id
          createdAt
          reactionBody
          username
        }
      }
      friends {
        _id
        username
      }
    }
  }
`;

// lets create one more me query like the one above,
// but we don't really need this much for the homepage, 
// so let's create one more using the me query that returns less data.
// With this query, we're requesting significantly less data to be returned 
// over HTTP. If we were to do this with a RESTful API, we'd have to create 
// another route to query a user and return less information. With GraphQL, we can 
// reuse the same query we created and simply ask for less.
export const QUERY_ME_BASIC = gql`
  {
    me {
      _id
      username
      email
      friendCount
      friends {
        _id
        username
      }
    }
  }
`;
