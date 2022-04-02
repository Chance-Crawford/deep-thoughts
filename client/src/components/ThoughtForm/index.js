import React, { useState } from 'react';

import { useMutation } from '@apollo/client';
import { ADD_THOUGHT } from '../../utils/mutations';

// when we submit the thought form and the thought gets added to the database, 
// we have to refresh the page to see the thought added to the user's thought list.
// This seems to go against what we recently learned about Apollo Client's cache. 
// Why isn't the cache being updated? Why do you need to make a new request to 
// the server to get the update?
// The Apollo Client tracks cached objects by their IDs. In this case, we've 
// added a new thought that should go inside an array of thoughts, but the array 
// itself has no ID to track. So the only way to get the updated array is to 
// re-request it from the server.
// We can remedy this problem by manually inserting the new thought object into 
// the cached array. The useMutation Hook can include an update function that 
// allows us to update the cache of any related queries. The query we'll 
// need to update is QUERY_THOUGHTS.

import { QUERY_THOUGHTS, QUERY_ME } from '../../utils/queries';

// Adding a thought will be a little more involved than adding a friend, because 
// we're dealing with text input and not just a single button. The ability to add thoughts 
// will also be available on multiple pages—the homepage and the Profile page—so we'll want 
// to set up this capability as its own component.
const ThoughtForm = () => {

    // prepare addThought mutation and destructure the error status of the
    // request.
    // Remember, the addThought() function will run the actual mutation. 
    // The error variable will initially be undefined but can change 
    // depending on if the mutation failed.
    const [addThought, { error }] = useMutation(ADD_THOUGHT, {

        // See above import { QUERY_THOUGHTS } for more comments.
        // add thought represents the thought that was just created.
        // Using the cache object, we can read what's currently saved in the 
        // QUERY_THOUGHTS cache and then update it with writeQuery() to 
        // include the new thought object.
        // updating the cached array of thoughts within the Apollo client so that the page
        // does not have to refresh to show the newly added thought
        // in the user's thought list.
        // Test this in the browser by using the form on the homepage to create a new 
        // thought. You'll see that the thought immediately displays at the top of the 
        // thought list, without refreshing the page or making a new request to the 
        // server!
        // Test this in the browser by using the form on the homepage to create a new thought. 
        // You'll see that the thought immediately displays at the top of the thought list, 
        // without refreshing the page or making a new request to the server!
        // Now navigate to the logged-in user's profile by clicking the Me link. Test the 
        // thought form on this page. Unfortunately, the cache doesn't seem to update here, 
        // and you're forced to reload the page to see the new thought. Why does it matter 
        // which page you're on if Profile and Home both use the same ThoughtForm component?
        // There are actually two things happening here:
        // The Profile page relies on QUERY_ME (not QUERY_THOUGHTS) to populate the thoughts, 
        // so updating the cache of the latter doesn't help.
        // If you visit the /profile route without first visiting the homepage, QUERY_THOUGHTS 
        // will have never been cached, resulting in an error when you try to read and update it.
        // To fix this issue, we'll first wrap the QUERY_THOUGHTS cache update in a try...catch 
        // statement to prevent the error from blocking the next step. That next step will be 
        // to update the thoughts array on the QUERY_ME cache.
        update(cache, { data: { addThought } }) {
            // we are updating the thought array cached in the query thoughts query
            // (if it exists). and the cached thought list from the 
            // query me query (for profile page thought list).
            try {
              // could potentially not exist yet, so wrap in a try...catch. See big comment
              // on top of update function.
              const { thoughts } = cache.readQuery({ query: QUERY_THOUGHTS });
              cache.writeQuery({
                query: QUERY_THOUGHTS,
                data: { thoughts: [addThought, ...thoughts] }
              });
            } 
            catch (e) {
              console.error(e);
            }
        
            // update me object's cache, appending new thought to the end of the array
            const { me } = cache.readQuery({ query: QUERY_ME });
            cache.writeQuery({
              query: QUERY_ME,
              data: { me: { ...me, thoughts: [...me.thoughts, addThought] } }
            });
        }
    });

    // state for updating the text from the user input
    // in the state.
    const [thoughtText, setText] = useState('');
    // state for capturing the character count within the textarea
    const [characterCount, setCharacterCount] = useState(0);

    // when user types anything into the textarea,
    // this function triggers. onChange
    const handleChange = event => {
        // checks to make sure the thought is less than 280 characters long before updating
        // the states.
        // At this point, test the form in the browser. You'll see that eventually you can't 
        // type anything else in the <textarea> element, because the handleChange() function 
        // stops updating the value of thoughtText once the character count reaches 280.
        // This happens because the textarea is only set to display the value of the 
        // thoughtText STATE. Once the text area reaches 280 characters, the state stops being updated,
        // so no more letters can be added to the textarea
        if (event.target.value.length <= 280) {
            setText(event.target.value);
            setCharacterCount(event.target.value.length);
        }
    };

    // when user submits the thought form. call mutation to the the server
    // to update the database.
    const handleFormSubmit = async event => {
        event.preventDefault();
        
        try {
            // add thought to database using prepared mutation
            await addThought({
                // send in thoughtText state as the parameter
                // to the mutation.
                // test the error message by trying to submit the form without 
                /// typing anything in the <textarea> element. The mutation 
                // should fail, because the $thoughtText parameter is required.
              variables: { thoughtText }
            });
        
            // clear state for form fields and value.
            setText('');
            setCharacterCount(0);
        } 
        catch (e) {
            console.error(e);
        }
    };
    
    return (
        <div>
            {/* check state to see if it is at its set maximum. once it is,
            change the text on the character count UI to red. 
            also check to see if there was an error with the mutation after a submit,
            if so turn red as well. */}
            <p className={`m-0 ${characterCount === 280 || error ? 'text-error' : ''}`}>
                {/* update character count UI whenever the state changes, when
                a character is added or subtracted */}
                Character Count: {characterCount}/280
                {/* conditional render if there is an error with the mutation
                after the thought is submitted. */}
                {error && <span className="ml-2">Something went wrong...</span>}
            </p>
            <form
            className="flex-row justify-center justify-space-between-md align-stretch"
            onSubmit={handleFormSubmit}
            >
                <textarea
                    placeholder="Here's a new thought..."
                    value={thoughtText}
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

export default ThoughtForm;