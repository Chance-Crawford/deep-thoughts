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
