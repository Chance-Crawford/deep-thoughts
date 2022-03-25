const express = require('express');
// import ApolloServer
const { ApolloServer } = require('apollo-server-express');

// import our typeDefs and resolvers
const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();

// see google docs, MERN Stack Notes, How GraphQL works
// Apollo server used to integrate GraphQL with our express server.
const startServer = async () => {
  // create a new Apollo server and pass in our schema data
  const server = new ApolloServer({ 
    // define the type definitions (queries and mutations) and resolvers
    // of the server
    typeDefs, 
    resolvers, 
    // context: authMiddleware 
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

db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
