import React from 'react';

// With React Router, however, you can't simply use <a> elements. 
// An element like <a href="/login"> would cause the browser to refresh 
// and make a new request to your server for /login. That would defeat the 
// whole purpose of React and its single-page goodness. Instead, you can use 
// React Router's Link component. This component will change the URL while 
// staying on the same page.
import { Link } from 'react-router-dom';

// use the Auth instance to check if the user is logged in by checking if there is an
// active JWT in their localStorage
import Auth from '../../utils/auth';


const Header = () => {

  // when the logout a element is clicked we're going to create a function 
  // that executes when clicked to run the .logout() method we created 
  // in the AuthService class.
  const logout = event => {
    // With the event.preventDefault(), we're actually overriding the <a> 
    // element's default nature of having the browser load a different resource. 
    // Instead, we execute the .logout() method, which will remove the token from 
    // localStorage and then refresh the application by taking the user back 
    // to the homepage.
    event.preventDefault();
    Auth.logout();
  };


  return (
    <header className="bg-secondary mb-4 py-2 flex-row align-center">
      <div className="container flex-row justify-space-between-lg justify-center align-center">
        <Link to="/">
          <h1>Deep Thoughts</h1>
        </Link>

        <nav className="text-center">
          {/* if logged in */}
          {Auth.loggedIn() ? (
            <>
            {/* profile with no username specified routes to the user's profile */}
              <Link to="/profile">Me</Link>
              <a href="/" onClick={logout}>
                Logout
              </a>
            </>
          ) : (
            // else
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
