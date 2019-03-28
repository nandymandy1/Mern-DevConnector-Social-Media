import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';

// Redux
import { Provider } from 'react-redux';

// JWT TOKEN
import jwt_decode from 'jwt-decode';
import setAuthToken from './providers/utils/setAuthToken';
import { setCurrentUser, logoutUser } from './providers/actions/authActions';

import Navbar from './components/layouts/Navbar';
import Footer from './components/layouts/Footer';
import Landing from './components/layouts/Landing';

// Auth Components
import Register from './components/auth/Register';
import Login from './components/auth/Login';
// Bring in the private protected routes
import PrivateRoute from './components/common/PrivateRoute';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile/CreateProfile';
import EditProfile from './components/profile/EditProfile';
import AddExperience from './components/edu-exp/AddExperience';
import AddEducation from './components/edu-exp/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import NotFound from './components/common/NotFound';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';


import store from './providers/store.js';
import { clearCurrentProfile } from './providers/actions/profileActions';


// Check for the token 
if (localStorage.jwt_token) {
  // set auth token header auth
  setAuthToken(localStorage.jwt_token);
  // decode token and get the user info and exp
  const decoded = jwt_decode(localStorage.jwt_token);
  // Set user and is authenticated
  store.dispatch(setCurrentUser(decoded));
  // check for the expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout the user
    store.dispatch(logoutUser());
    // clear the current profile
    store.dispatch(clearCurrentProfile());
    // Redirect to login
    window.location.href = '/login';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path='/' component={Landing} />
            <div className="container">
              <Route exact path='/login' component={Login} />
              <Route exact path='/register' component={Register} />
              <Route exact path='/profiles' component={Profiles} />
              <Route exact path='/profile/:handle' component={Profile} />
              <Switch>
                <PrivateRoute
                  exact
                  path='/dashboard'
                  component={Dashboard}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path='/create-profile'
                  component={CreateProfile}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path='/edit-profile'
                  component={EditProfile}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path='/add-experience'
                  component={AddExperience}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path='/add-education'
                  component={AddEducation}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path='/feed'
                  component={Posts}
                />
              </Switch>
              <Switch>
                <PrivateRoute
                  exact
                  path='/post/:id'
                  component={Post}
                />
              </Switch>
              <Route
                exact
                path="/not-found"
                component={NotFound}
              />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;

