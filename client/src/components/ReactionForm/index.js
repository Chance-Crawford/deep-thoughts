import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_REACTION } from '../../utils/mutations';

// see ThoughtForm for more comments.
// component that captures input for reactions
// and adds the reactions to user's thoughts.
// With reactions we do not have to update the cache to immediately
// display them to the page like we had to do with the ThoughtForm.
// Updating the cache works seamlessly here, because the mutation 
// returns the parent thought object that includes the updated reactions 
// array as a property. If the mutation returned the reaction object instead, 
// then we'd have another situation in which the cache would need a manual update.
const ReactionForm = ({ thoughtId }) => {

    // prepare the mutation function and destructure the error status of the
    // request.
    // Remember, the addThought() function will run the actual mutation. 
    // The error variable will initially be undefined but can change 
    // depending on if the mutation failed.
    const [addReaction, { error }] = useMutation(ADD_REACTION);

    const [reactionBody, setBody] = useState('');
    const [characterCount, setCharacterCount] = useState(0);

    const handleChange = event => {
        if (event.target.value.length <= 280) {
            setBody(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    const handleFormSubmit = async event => {
        event.preventDefault();

        // Finally, update the handleFormSubmit() function 
        // to call addReaction(), passing in the values of reactionBody 
        // and thoughtId as the mutation's variables.
        try {
            // add reaction to database using prepared mutation
            await addReaction({
                // send in the reactionBody state and thoughtId as the parameters
                // to the mutation.
                // test the error message by trying to submit the form without 
                // typing anything in the <textarea> element. The mutation 
                // should fail, because the $reactionBody parameter is required.
              variables: { reactionBody, thoughtId }
            });
        
            // clear state for form fields and value.
            setBody('');
            setCharacterCount(0);
        } 
        catch (e) {
            console.error(e);
        }
    };


    return (
        <div>
        <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
            Character Count: {characterCount}/280
            {error && <span className="ml-2">Something went wrong...</span>}
        </p>
        <form className="flex-row justify-center justify-space-between-md align-stretch" onSubmit={handleFormSubmit}>
            <textarea
            value={reactionBody}
            placeholder="Leave a reaction to this thought..."
            className="form-input col-12 col-md-9"
            onChange={handleChange}
            ></textarea>

            <button className="btn col-12 col-md-3" type="submit">
            Submit
            </button>
        </form>
        </div>
    );
};

export default ReactionForm;