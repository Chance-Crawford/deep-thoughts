import React from 'react';

import { useParams } from 'react-router-dom';

import ThoughtList from '../components/ThoughtList';

import { useQuery } from '@apollo/client';
import { QUERY_USER } from '../utils/queries';

import FriendList from '../components/FriendList';


const Profile = () => {
  // useParams takes the parameters from the url and
  // turns the the parameters into properties of an object. 
  // the value stored in the parameter username is put into the 
  // constant userParam.
  const { username: userParam } = useParams();

  const { loading, data } = useQuery(QUERY_USER, {
    // pass username from the param into the user query
    // to find the data on the specific user.
    variables: { username: userParam }
  });

  // The user object that is created afterwards is used to populate the JSX. 
  // This includes passing props to the ThoughtList component to render a list 
  // of thoughts unique to this user.
  const user = data?.user || {};

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex-row mb-3">
        <h2 className="bg-dark text-secondary p-3 display-inline-block">
          Viewing {user.username}'s profile.
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
