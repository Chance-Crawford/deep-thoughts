// see google docs, MERN Stack Notes, How GraphQL works
const { User, Thought } = require('../models');

const { AuthenticationError } = require('apollo-server-express');

// generates a json web token which will include all the user's data
// on login or account creation
const { signToken } = require('../utils/auth');

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

    // see google docs, MERN Stack Notes, Implement Auth JWT Middleware to Populate Me Query
    // captures the current user who is logged in from the JWT.
    me: async (parent, args, context) => {
      // if the user is logged in (by having a valid JWT), then a custom field will
      // exist on the context object called user, which holds the data of the current user,
      // such as username, _id and email.
      // check for the existence of context.user. If no context.user property exists, 
      // then we know that the user isn't authenticated and we can throw an AuthenticationError.
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id })
          .select('-__v -password')
          .populate('thoughts')
          .populate('friends');
    
        return userData;
      }
    
      throw new AuthenticationError('Not logged in');

    }
  },

  // A GraphQL query retrieves data, which only accounts for one CRUD operation. 
  // But what about creating, updating, and deleting? For those operations, you can 
  // use a mutation.
  // This mutation property will hold all the mutation resolvers. This means
  // all resolvers that create, update, and delete.
  Mutation: {

    addUser: async (parent, args) => {
      // creates a user from the args object defined in typeDefs.js
      // Here, the Mongoose User model creates a new user in the database 
      // with whatever is passed in as the args.
      const user = await User.create(args);

      // generates a json web token which will include all the user's data
      // on login or account creation. Defined in utils/auth.js
      const token = signToken(user);
    
      // return an object that combines the token with the user's data.
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      // finds a user in mongoDB database using mongoose
      // by their email.
      // if no user with that email exists, nothing will be 
      // returned into the user variable.
      const user = await User.findOne({ email });
    
      // GraphQL can handle errors for you, though, and it 
      // automatically relays the error to the client.
      // If a user tries to log in with the wrong username or 
      // password, we'll want to return an authentication error. 
      // GraphQL actually has such error handling built in
      // as long as you require it at the top of the file.
      if (!user) {
        // Normally, throwing an error like this would cause your 
        // server to crash, but GraphQL will catch the error and send it to the client instead.
        // Notice that the error message doesn't specify whether the email or password is 
        // incorrect. If a malicious user is trying to hack into someone's account, 
        // for example, you won't want to confirm that they've guessed the email address 
        // correctly and only need to focus on the password now.
        throw new AuthenticationError('Incorrect credentials');
      }
    
      // uses bcrypt to compare the incoming password with the hashed password
      const correctPw = await user.isCorrectPassword(password);
    
      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }
    
      // see above, addUser
      const token = signToken(user);
      return { token, user };
    },

    addThought: async (parent, args, context) => {
      // if user has valid token
      if (context.user) {
        // creates a new thought with the data given in args and adds
        // the user's username from the context.
        const thought = await Thought.create({ ...args, username: context.user.username });
    
        // push new thought to user's array
        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          // Remember, without the { new: true } flag 
          // in User.findByIdAndUpdate(), Mongo would return the original 
          // document instead of the updated document.
          { new: true }
        );
    
        return thought;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },

    addReaction: async (parent, { thoughtId, reactionBody }, context) => {
      if (context.user) {
        const updatedThought = await Thought.findOneAndUpdate(
          { _id: thoughtId },
          // push new reaction to thought's reactions array
          { $push: { reactions: { reactionBody, username: context.user.username } } },
          { new: true, runValidators: true }
        );
    
        return updatedThought;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    },

    addFriend: async (parent, { friendId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          // This mutation will look for an incoming friendId and add that to 
          // the current user's friends array. A user can't be friends with the same 
          // person twice, though, hence why we're using the $addToSet operator instead 
          // of $push to prevent duplicate entries.
          { $addToSet: { friends: friendId } },
          { new: true }
        ).populate('friends');
    
        return updatedUser;
      }
    
      throw new AuthenticationError('You need to be logged in!');
    }

  }
  
};
  
  module.exports = resolvers;