import React from 'react';

// See App.js. we allowed for react router URLs
// to take parameters.
// The SingleThought component displays hardcoded data for now, 
// but we'll update this component to be more dynamic. Notice how the URL 
// includes the ID of the thought being viewed. We can grab that ID 
// and query the database for the thought's full information.
// How would you access the ID from the URL, though? You could use something 
// like document.location to parse out the ID, but React Router has 
// a better method built in called useParams.
import { useParams } from 'react-router-dom';

// query the database for the single thought query.
import { useQuery } from '@apollo/client';
import { QUERY_THOUGHT } from '../utils/queries';

import ReactionList from '../components/ReactionList';

import ReactionForm from '../components/ReactionForm';

import Auth from '../utils/auth';



const SingleThought = props => {

  // takes the id property returned from the URL param using useParams()
  // and assigns the value of the id property to the variable
  // thoughtID.
  const { id: thoughtId } = useParams();

  const { loading, data } = useQuery(QUERY_THOUGHT, {
    // This is how you can pass variables to queries that need them. 
    // The id property on the variables object will become the $id 
    // parameter in the GraphQL query.
    // This is how you pass in a value to the query's parameter.
    // we put in the value retieved in the thoughtId variable above.
    variables: { id: thoughtId }
  });
  
  // What we're saying is, if data exists, store it in the thought constant we just created. 
  // If data is undefined, then save an empty object to the thought constant. Since this is React,
  // once the data exists the variable will update automatically and the thought will render.
  const thought = data?.thought || {};
  
  // if the thought request is currently loading, send back this HTML
  if (loading) {
    return <div>Loading...</div>;
  }

  // Once the thought data is no longer loading and is received, capture the data in this HTML
  // and send this back.
  return (
    <div>
      <div className="card mb-3">
        <p className="card-header">
          <span style={{ fontWeight: 700 }} className="text-light">
            {thought.username}
          </span>{' '}
          thought on {thought.createdAt}
        </p>
        <div className="card-body">
          <p>{thought.thoughtText}</p>
        </div>
      </div>


      {/* The thought text is displaying correctly, but there are no reactions yet. 
      Reactions are available on the thought.reactions property, so you would just 
      need to map these into JSX elements. To keep the code organized and reusable, 
      however, it would be better to create a separate component for listing reactions
      so we made the ReactionList component. 
      Render the component if the current thought has any reactions. 
      passing in the reactions array as a prop to the ReactionList component. 
      props.reactions */}
      {thought.reactionCount > 0 && <ReactionList reactions={thought.reactions} />}

      {/* render the form to add a reaction if the user viewing the page is logged in.
      pass in the id of the thought that is being displayed. */}
      {Auth.loggedIn() && <ReactionForm thoughtId={thought._id} />}
    </div>
  );
};

export default SingleThought;
