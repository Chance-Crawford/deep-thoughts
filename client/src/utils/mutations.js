import { gql } from '@apollo/client';

// mutation to login a user from the front end.
// This will accept two variables, $email and $password, whose values 
// we'll set up to be passed in as arguments when we integrate this 
// with the login form page.
// these mutations allow us to say what exactly we are sending into the backend
// and what exactly we want to be returned from the backend after the mutation.
// In return, we expect the logged-in user's data and the token. 
// With this token, we'll be able to perform other actions unique to the logged-in user.
// Remember, the names and format that we use have to match what we set up on the server!
export const LOGIN_USER = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;

// signing up a user
// This mutation is essentially the same as the LOGIN_USER one we created earlier, 
// with the exception that we are now asking for an email address as well. The 
// returning data should be the same, so we don't have to add the extra step for 
// users to log in after signing up.
export const ADD_USER = gql`
  mutation addUser($username: String!, $email: String!, $password: String!) {
    addUser(username: $username, email: $email, password: $password) {
      token
      user {
        _id
        username
      }
    }
  }
`;