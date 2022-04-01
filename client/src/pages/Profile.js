import React from 'react';

// if the user that is logged in types their own username into the 
// URL we want it to redirect to the /profile regular link using
// auth and redirect.
// This component, Redirect, will allow us to redirect the user to 
// another route within the application. Think of it like how we've 
// used location.replace() in the past, but it leverages React Router's 
// ability to not reload the browser!
// The Redirect component is extremely useful, so make sure you take a 
// moment or two to learn it—and keep it in mind as you build future applications!
import { Redirect, useParams } from 'react-router-dom';
import Auth from '../utils/auth';

import ThoughtList from '../components/ThoughtList';

import { useQuery } from '@apollo/client';

import { QUERY_USER, QUERY_ME } from '../utils/queries';

import FriendList from '../components/FriendList';




const Profile = () => {
  // useParams takes the parameters from the url and
  // turns the the parameters into properties of an object. 
  // the value stored in the parameter username is put into the 
  // constant userParam.
  const { username: userParam } = useParams();

  // if there's a value in userParam that we got from the URL bar, we'll 
  // use that value to run the QUERY_USER query for another user's profile. If there's 
  // no value in userParam, like if we simply visit /profile as a logged-in user, we'll 
  // execute the QUERY_ME query instead.
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    // pass username from the param into the user query
    // to find the data on the specific user.
    variables: { username: userParam }
  });

  // The user object that is created afterwards is used to populate the JSX. 
  // This includes passing props to the ThoughtList component to render a list 
  // of thoughts unique to this user.
  // if a "me" object was returned from the query then it is the logged in user's so we will
  // populate that. Otherwise if the user query was activated other than the user that
  // is logged in we will populate that. else, return an empty object until the request is 
  // finished/completed.
  const user = data?.me || data?.user || {};

  // With this, we're checking to see if the user is logged in and if so
  // redirect to personal profile page if username parameter is the same as the current
  // logged in user.
  if (Auth.loggedIn() && Auth.getProfile().data.username === userParam) {
    return <Redirect to="/profile" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  // if someone tries to visit /profile but is not logged in,
  // return this instead.
  // Now if there is no user data to display, we know that we aren't logged in or 
  // at another user's profile page. Instead of redirecting the user away, we simply inform 
  // them that they need to be logged in to see this page and they must log in or 
  // sign up to use it.
  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this page. Use the navigation links above to sign up or log in!
      </h4>
    );
  }

  return (
    <div>
      <div className="flex-row mb-3">
        {/* Now if userParam doesn't exist, we'll get a message saying "Viewing your 
        profile." Otherwise, it will display the username of the other user on their profile. */}
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {userParam ? `${user.username}'s` : 'your'} profile.
        </h2>
      </div>

      <div className="flex-row justify-space-between mb-3">
        <div className="col-12 mb-3 col-lg-8">
          <ThoughtList thoughts={user.thoughts} title={`${user.username}'s thoughts...`} />
        </div>

        <div className="col-12 col-lg-3 mb-3">
          {/* send in the user's username, friend count, and friends array
          into the FriendList component as props. */}
          <FriendList
            username={user.username}
            friendCount={user.friendCount}
            friends={user.friends}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;
