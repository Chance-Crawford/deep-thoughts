import React from 'react';

// see Header.js
// Next, you'll need to update the thoughts listed on the homepage to render 
// the SingleThought component when the thought text is clicked and the Profile 
// component when the author name is clicked.
import { Link } from 'react-router-dom';

// integrate list of thoughts into the Home component.
// Here we instruct that the ThoughtList component will receive two props: a 
// title and the thoughts array. We destructure the argument data to avoid using 
// props.title and props.thoughts throughout the JSX code.
const ThoughtList = ({ thoughts, title }) => {
    // We conditionally render JSX by checking to see if there's even 
    // any data in the thoughts array first. If there's no data, then 
    // we return a message stating that.
  if (!thoughts.length) {
    return <h3>No Thoughts Yet</h3>;
  }

  return (
    // If there is thought array data, then we return a list of thoughts using the .map() method.
    <div>
      <h3>{title}</h3>
      {thoughts &&
        thoughts.map(thought => (
            // key helps React internally track which data needs to be re-rendered if something changes.
          <div key={thought._id} className="card mb-3">
            <p className="card-header">
              <Link
                to={`/profile/${thought.username}`}
                style={{ fontWeight: 700 }}
                className="text-light"
              >
                {thought.username}
              </Link>{' '}
              thought on {thought.createdAt}
            </p>
            <div className="card-body">
              <Link to={`/thought/${thought._id}`}>
                <p>{thought.thoughtText}</p>
                <p className="mb-0">
                    {/* Notice how we also check to see the value of thought.reactionCount. 
                    We're conditionally displaying a message to contextualize what the call 
                    to action should be. If there are no reactions, the user will start the 
                    discussion by adding the first reaction. If there are reactions, the user will 
                    view or add their own reaction to an existing list. */}
                  Reactions: {thought.reactionCount} || Click to{' '}
                  {thought.reactionCount ? 'see' : 'start'} the discussion!
                </p>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ThoughtList;