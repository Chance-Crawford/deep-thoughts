// see google docs, MERN Stack Notes, How GraphQL works
const { User, Thought } = require('../models');

// see google docs, MERN Stack Notes, Create the Thought Type Definition and Resolver
// resolvers resolve every query and mutation defined in typeDefs.js.
// resolvers serve the responses for the queries defined in typeDefs.js.
const resolvers = {
  // see google docs, MERN Stack Notes, Test the Thought Query, returning array data of a custom data type in GraphQL
  Query: {
    // see google docs, MERN Stack Notes, Test the Thought Query, Look Up Thoughts by Username
    // Here, we pass in the parent as more of a placeholder parameter. It won't be used, but 
    // we need something in that first parameter's spot so we can access the username argument 
    // from the second parameter. We use a ternary operator to check if username exists. 
    // username is a parameter defined in typeDefs.js, If username value 
    // does exist, we set params to an object with a username key set to that value. If it doesn't, 
    // we simply return an empty object.
    // We're also returning the thought data in descending order, as can be seen in the .sort() 
    // method that we chained onto it. We don't have to worry about error handling here 
    // because Apollo can infer if something goes wrong and will respond for us.
    // With this updated resolver function, we are now using the parameters to which the apollo-server 
    // library passes argument data so we can have a more dynamic interaction with our server. A 
    // resolver can accept four arguments in the following order:
    // 1. parent: This is if we used nested resolvers to handle more complicated actions, as it 
    // would hold the reference to the resolver that executed the nested resolver function. We won't 
    // need this throughout the project, but we need to include it as the first argument.
    // 2. args: This is an object of all of the values passed into a query or mutation request as 
    // parameters. In our case, we destructure the username parameter out to be used.
    // 3. context: This will come into play later. If we were to need the same data to 
    // be accessible by all resolvers, such as a logged-in user's status or API access token, 
    // this data will come through this context parameter as an object.
    // 4. info: This will contain extra information about an operation's current state. 
    // This isn't used as frequently, but it can be implemented for more advanced uses.
    thoughts: async (parent, { username }) => {
      const params = username ? { username } : {};
      return Thought.find(params).sort({ createdAt: -1 });
    },

    // resolver function to find a single thought.
    // similar to how we handled thoughts, we destructure the _id argument value and 
    // place it into our .findOne() method to look up a single thought by its _id.
    thought: async (parent, { _id }) => {
      // checks the Thought model in the database to return a single thought
      // with the given id.
      return Thought.findOne({ _id });
    },

    // get all users
    // Again, this is a great feature of GraphQL. We have a single function that 
    // will return every single piece of data associated with a user, but none of it 
    // will be returned unless we explicitly list those fields we want when we 
    // perform our queries.
    users: async () => {
      return User.find()
      // omit the Mongoose-specific __v property and the user's password 
      // information
        .select('-__v -password')
        // We also populate the fields for friends and thoughts, so we 
        // can get any associated data in return.
        .populate('friends')
        .populate('thoughts');
    },

    // get a user by username
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select('-__v -password')
        .populate('friends')
        .populate('thoughts');
    },
  }
  
};
  
  module.exports = resolvers;