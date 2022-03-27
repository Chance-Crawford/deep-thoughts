// see google docs, MERN Stack Notes, Authorize Users with JWTs

const jwt = require('jsonwebtoken');

// Optionally, tokens can be given an expiration date and a secret 
// to sign the token with. Note that the secret has nothing to do 
// with encoding. The secret merely enables the server to verify 
// whether it recognizes this token.
// If your JWT secret is ever compromised, you'll need to generate 
// a new one, immediately invalidating all current tokens. Because 
// the secret is so important, you should store it somewhere other 
// than in a JavaScript file—like an environment variable.
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
    // The signToken() function expects a user object and will 
    // add that user's username, email, and _id properties to the token
    // to be decoded later.
  signToken: function({ username, email, _id }) {
    const payload = { username, email, _id };

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },

  // see google docs, MERN Stack Notes, Implement Auth JWT Middleware to Populate Me Query
  // performs logic with the headers like verifying the JWT.
  // checks to see if there is a valid JWT sent with each request. If there is a valid
  // token, create a user property that holds the user's info.
  // tokens are only given by loogging in or signing up.
  authMiddleware: function({ req }) {
    // allows token to be sent via req.body, req.query, or headers
    let token = req.body.token || req.query.token || req.headers.authorization;
  
    // separate "Bearer" from "<tokenvalue>"
    if (req.headers.authorization) {
      token = token
        .split(' ')
        .pop()
        .trim();
    }
  
    // if no token, return request object as is
    if (!token) {
      return req;
    }
  
    // This is where the secret becomes important. If the secret on jwt.verify() 
    // doesn't match the secret that was used with jwt.sign(), the object won't be 
    // decoded. When the JWT verification fails, an error is thrown.
    // We don't want an error thrown on every request, though. Users with an invalid 
    // token should still be able to request and see all thoughts. Thus, we wrapped 
    // the verify() method in a try...catch statement to mute the error. We'll manually 
    // throw an authentication error on the resolver side when the need arises.
    try {
      // decode JWT and attach the returned user data to request object.
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.user = data;
    } catch {
      console.log('Invalid token');
    }
  
    // return updated request object
    return req;
  }
};