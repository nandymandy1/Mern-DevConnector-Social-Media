import axios from 'axios';
import jwt_decode from 'jwt-decode';

// Types imports
import { GET_ERRORS, LOGIN_USER } from './types';

// Import UTILS
import setAuthToken from '../utils/setAuthToken';


// Register User
export const registerUser = (userData, history)=> (dispatch) => {
    axios.post(`/api/users/register`, userData)
            .then(res => history.push('/login'))
            .catch(err => dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            }));
};

// Login User
export const loginUser = (userData) => (dispatch) => {
    axios.post(`/api/users/login`, userData)
            .then(res => {
                // Save to localstorage
                const { token } = res.data;
                localStorage.setItem('jwt_token',token);
                // Set token to auth header
                setAuthToken(token);
                // decode token to get user data
                const decoded = jwt_decode(token);
                // Set current user
                dispatch(setCurrentUser(decoded));
            })
            .catch(err => dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            }));
};

// Set logged in user
export const setCurrentUser = (decoded) => {
    return {
        type: LOGIN_USER,
        payload: decoded
    }
}

// Logut the user
export const logoutUser = () => (dispatch) => {
    // Remove the token from localstorage
    localStorage.removeItem('jwt_token');
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
}