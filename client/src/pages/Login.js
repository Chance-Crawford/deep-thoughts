import React, { useState } from 'react';

// see google docs, MERN Stack Notes, Create and Implement User-Based Mutations
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';

const Login = (props) => {
  const [formState, setFormState] = useState({ email: '', password: '' });

  // Again, we'll have to initialize our LOGIN_USER mutation with the useMutation() Hook first.
  //the initialized function gets stored in login.
  const [login, { error }] = useMutation(LOGIN_USER);

  // update state based on form input changes
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

    try {
      const { data } = await login({
        // Remember that the ... in this context is being used as the spread operator. 
        // This means that we are setting the variables field in our mutation to be an 
        // object with key/value pairs that match directly to what our formState object looks like.
        variables: { ...formState }
      });
  
      console.log(data);
    } catch (e) {
      console.error(e);
    }

    // clear form values
    setFormState({
      email: '',
      password: '',
    });
  };

  return (
    <main className='flex-row justify-center mb-4'>
      <div className='col-12 col-md-6'>
        <div className='card'>
          <h4 className='card-header'>Login</h4>
          <div className='card-body'>
            <form onSubmit={handleFormSubmit}>
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
            {error && <div>Login failed</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
