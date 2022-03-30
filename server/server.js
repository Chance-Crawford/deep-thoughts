const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const path = require('path');

// auth users using JWT
const { authMiddleware } = require('./utils/auth');

const PORT = process.env.PORT || 3001;
const app = express();

// *****TO RUN THE SERVER AND CLIENT, type npm run develop. This will run both servers
// using concurrently

// see google docs, MERN Stack Notes, How GraphQL works
// Apollo server used to integrate GraphQL with our express server.
const startServer = async () => {
  // create a new Apollo server and pass in our schema data
  const server = new ApolloServer({ 
    // define the type definitions (queries and mutations) and resolvers
    // of the server
    typeDefs, 
    resolvers, 
    // see google docs, MERN Stack Notes, Implement Auth JWT Middleware to Populate Me Query
    // When you instantiate a new instance of ApolloServer, you can 
    // pass in a context method that's set to return whatever you 
    // want available in the resolvers from the req object.
    // This ensures that every request performs an authentication check, and the 
    // updated request object will be passed to the resolvers as the context.
    // Remember, the decoded JWT is only added to context if the verification passes. 
    // The token includes the user's username, email, and _id properties, which become 
    // properties of context.user and can be used. 
    // keep in mind that the current user's JWT will be sent along with every request
    // that needs authorization.
    // see utils/auth.js
    context: authMiddleware
  });

  // Start the Apollo server
  await server.start();

  // integrate our Apollo server with the Express application as middleware
  // We then connect our Apollo server to our Express.js server. This will create 
  // a special /graphql endpoint for the Express.js server that will serve as the 
  // main endpoint for accessing the entire API. That's not all—the /graphql endpoint 
  // also has a built-in testing tool we can use.
  // see google docs, MERN Stack Notes, How GraphQL works
  server.applyMiddleware({ app });

  // log where we can go to test our GQL API
  console.log(`Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`);
};

// Initialize the Apollo server
startServer();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());


// Serve up static assets
// We just added two important pieces of code that will only come into effect 
// when we go into production. First, we check to see if the Node environment 
// is in production. If it is, we instruct the Express.js server to serve any 
// files in the React application's build directory in the client folder.
// remember this is for production only.
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// The next set of functionality we created was a wildcard GET route for the 
// server. In other words, if we make a GET request to any location on the 
// server that doesn't have an explicit route defined, respond with the production-ready 
// React front-end code.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});


db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
