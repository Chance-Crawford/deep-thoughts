// see google docs, MERN Stack Notes, Create Authentication Functionality with front end using JWT and log 
// user out when token expires
// The library we're going to install is called jwt-decode, and serves as 
// a helper library working with JSON Web Tokens; it's only missing the functionality 
// for creating and validating the token. Instead, it's used to extract 
// nonsensitive data such as the expiration date so we can check if it has expired 
// before we make a request to the server that needs it.
// We'll do this on the client side as a way to avoid making a needless number of 
// requests to the server. Before every single request, we'll verify in the browser if our 
// token is still valid. If it is, we'll make the request.
import decode from 'jwt-decode';

// We don't want to directly couple our authentication functionality 
// to any one component, as many of our 
// components will need to use it. Instead, we'll create another file for all of it.
// With this, we're creating a new JavaScript class called AuthService that we instantiate 
// a new version of for every component that imports it. This isn't always necessary, 
// but it does ensure we are using a new version of the functionality and takes some 
// of the risk out of leaving remnant data hanging around.
// The last thing we need to do is instruct the Apollo instance in App.js to retrieve this 
// token every time we make a GraphQL request. We'll need to import another function 
// from Apollo Client that will retrieve the token from localStorage and include it with 
// each request to the API. We will do that with setContext in App.js.
// Notice how the logging out functionality does not interact with the server. This is one 
// of the perks of using JSON Web Tokens. Because the server doesn't keep track of who's 
// logged in, it also doesn't need to know who's trying to leave either. Because of this, 
// we can avoid users making needless requests to the server and seriously reduce 
// the amount of work it has to do.
class AuthService {
    // retrieve data saved in token
    getProfile() {
        return decode(this.getToken());
    }

    // check if the user is still logged in
    // if we call the .loggedIn() method from a component, we'll get a 
    // simple true or false in return
    loggedIn() {
        // Checks if there is a saved token and it's still valid
        const token = this.getToken();
        // use type coersion to check if token is NOT undefined and the token is NOT expired
        return !!token && !this.isTokenExpired(token);
    }

    // check if the token has expired
    isTokenExpired(token) {
        try {
        const decoded = decode(token);
        if (decoded.exp < Date.now() / 1000) {
            return true;
        } else {
            return false;
        }
        } catch (err) {
            return false;
        }
    }

    // retrieve token from localStorage
    getToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('id_token');
    }

    // set token to localStorage and reload page to homepage
    login(idToken) {
        // Saves user token to localStorage
        localStorage.setItem('id_token', idToken);

        window.location.assign('/');
    }

    // clear token from localStorage and force logout with reload
    logout() {
        // Clear user token and profile data from localStorage
        localStorage.removeItem('id_token');
        // this will reload the page and reset the state of the application
        window.location.assign('/');
    }
}

export default new AuthService();