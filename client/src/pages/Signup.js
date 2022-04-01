import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';

// see utils/auth.js
import Auth from '../utils/auth';

const Signup = () => {
  const [formState, setFormState] = useState({ username: '', email: '', password: '' });

  // You might initially think this is immediately executing the ADD_USER mutation, 
  // just as useQuery() would. Instead, the useMutation() Hook creates and prepares a 
  // JavaScript function that wraps around our mutation code and returns it to us. 
  // In our case, it returns in the form of the addUser function that's returned. We 
  // also get the ability to check for errors.
  // What's the term used for executing a function that scopes data to a new 
  // function and returns it to run at a later time?
  // Answer:
  // A closure.
  const [addUser, { error }] = useMutation(ADD_USER);

  // update state based on form input changes. Anytime anything is typed
  // in an input field. onChange.
  // You'll see that we already have functionality for capturing form field data 
  // from a user and storing it in state using the useState() Hook from React. 
  // All we need to do is create the functionality for taking that data on submit 
  // and sending it to the server through our mutation.
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormState({
      ...formState,
      [name]: value,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // use try/catch instead of promises to handle errors
    // We use the try...catch block functionality here, as it is 
    // especially useful with asynchronous code such as Promises. This way, we 
    // can use async/await instead of .then() and .catch() method-chaining while 
    // still being able to handle any errors that may occur.
    try {
      // execute addUser mutation 
      // Upon success, we destructure the data object from 
      // the response of our mutation and simply log it to see if 
      // we're getting our token.
      const { data } = await addUser({
        // and pass in variable data from form
        variables: { ...formState }
      });

      // after user data is returned, get the user's json web token
      // and use the custom Auth object to add the token to the 
      // local storage.
      Auth.login(data.addUser.token);
    } 
    catch (e) {
      console.error(e);
    }
  };

  return (
    <main className='flex-row justify-center mb-4'>
      <div className='col-12 col-md-6'>
        <div className='card'>
          <h4 className='card-header'>Sign Up</h4>
          <div className='card-body'>
            <form onSubmit={handleFormSubmit}>
              <input
                className='form-input'
                placeholder='Your username'
                name='username'
                type='username'
                id='username'
                value={formState.username}
                onChange={handleChange}
              />
              <input
                className='form-input'
                placeholder='Your email'
                name='email'
                type='email'
                id='email'
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className='form-input'
                placeholder='******'
                name='password'
                type='password'
                id='password'
                value={formState.password}
                onChange={handleChange}
              />
              <button className='btn d-block w-100' type='submit'>
                Submit
              </button>
            </form>
            {/* One more thing that we want to add is error handling for the user to see. 
            Thus if something goes wrong, such as a username or email address that isn't 
            unique, the user will be notified. Luckily for us, we already have the ability to 
            capture the error, as we set up with the destructured error object towards the 
            top of the component. Let's put that to use in our returning JSX. */}
            {error && <div>Sign up failed</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
