// see google docs, MERN Stack Notes, How GraphQL works
// import the gql tagged template function
const { gql } = require('apollo-server-express');

// see google docs, MERN Stack Notes, Create the Thought Type Definition and Resolver
// create our typeDefs
// Tagged templates are an advanced use of template literals, and were 
// introduced with ES6 as well. The syntax for them is a little off-putting at times, 
// and it can be hard to understand exactly how it works. That's okay, though! 
// With tagged template functions like this, it's typically from a library that provides 
// explicit details on how it's used in that situation
// All of our type definitions will go into the typeDefs tagged template function.
// Remember that with GraphQL, we access our API through two passages: queries and mutations. 
// To define a query, you use the type Query {} data type, which is built into GraphQL. From 
// there, you can define your different types of queries by naming them, just as you would 
// name a function in JavaScript.
// All type definitions need to specify what type of data is expected in return
// such as helloWorld: String, inside of type Query{}
// would be a quer that is explicitly specified that the type of data to be 
// returned by this query will be a string.
const typeDefs = 
// see google docs, MERN Stack Notes, Test the Thought Query, returning array data of a custom data type in GraphQL
// we are creating a custom Thought data type.
// With this custom data type, we are able to instruct the thoughts query so that 
// each thought that returns can include _id, thoughtText, username, and reactionCount 
// fields with their respective GraphQL scalars. The new ones here, ID and Int, are indeed 
// new to us. ID is essentially the same as String except that it is looking for a unique 
// identifier; and Int is simply an integer.
// Just like a GET request for /api/thoughts, we want to set up 
// this query to retrieve an array of all thought data from the 
// database. Remember, though, that GraphQL demands that we 
// explicitly define the type of data that is returning. This was easy to 
// do with helloWorld, as String is a built-in data type, or scalar. With this, 
// we need to return more complex data that has key/value pairs.
// Luckily, we can create our own custom types that define what we 
// want to have returned from this query. Such as thoughts: [Thought]
// With this, we're instructing our query that we'll return an array, 
// as noted by the [] square brackets around the returning data, Thought. 
// The Thought data type will be the custom Thought data type we're 
// about to create.
// Thought itself contains a nested array of Reaction types. Then we create
// that Reaction custom type.
// With this in place, we have now set it up so that when we run the thoughts 
// query, we can also list the reactions field to get back an array of reaction 
// data for each thought. As a reminder, "reactions" are simply replies to or 
// comments about a single thought.
gql`
    type Thought {
        _id: ID
        thoughtText: String
        createdAt: String
        username: String
        reactionCount: Int
        reactions: [Reaction]
    }

    type Reaction {
        _id: ID
        reactionBody: String
        createdAt: String
        username: String
    }

    type User {
        _id: ID
        username: String
        email: String
        friendCount: Int
        thoughts: [Thought]
        friends: [User]
    }

    type Query {
        users: [User]
        user(username: String!): User
        thoughts(username: String): [Thought]
        thought(_id: ID!): Thought
    }
`;
// ^^^^^ thoughts(username: String): [Thought] With this, we've now defined our thoughts query 
// that it could receive a parameter if we wanted. In this case, the parameter would be 
// identified as username and would have a String data type.
// Keep in mind that the way we set this up will allow us to query thoughts with or 
// without the username parameter. If we needed to enforce a parameter for our query, we'd 
// have to add something else to it
// Notice the exclamation point ! after the query parameter data type definitions? That 
// indicates that for that query to be carried out, that data must exist. Otherwise, Apollo 
// will return an error to the client making the request and the query won't even reach the 
// resolver function associated with it.
// Earlier, we didn't enforce a query parameter for thoughts because it wasn't necessary for 
// the query to work. If there's no parameter, we simply return all thoughts. But if we want 
// to look up a single thought or user, we need to know which one we're looking up and thus 
// necessitate a parameter for us to look up that data.
// To find a single user we will use the thought query, and for a single user we will use the user query.
// With this type, we define that a user will return all the data in their Mongoose model. 
// Note that the friends field is an array that will be populated with data that also adheres 
// to the User type, as a user's friends should follow the same data pattern as that user. Also 
// notice the thoughts field is an array of Thought types

// export the typeDefs
module.exports = typeDefs;