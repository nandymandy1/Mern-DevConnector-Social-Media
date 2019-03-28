const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateRegisterInput(data) {
    let errors = {};

    data.name = !isEmpty(data.name) ? data.name : '';
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';
    data.password2 = !isEmpty(data.password2) ? data.password2 : '';

    if (!Validator.isLength(data.name, {
            min: 5,
            max: 30
        })) {
        errors.name = 'Name must be between 2 to 30 characters.';
    }
    // Check for the Name
    if (Validator.isEmpty(data.name)) {
        errors.name = 'Name field is required';
    }
    // Check for the Email
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }
    // Check for valid the Email
    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }
    // Check for the Password
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    // Check for the Password length
    if (!Validator.isLength(data.password, {
            min: 6,
            max: 20
        })) {
        errors.password = 'Password must atleast 6 characters.';
    }

    // Check for the Confirm Password
    if (Validator.isEmpty(data.password2)) {
        errors.password2 = 'Confirm password field is required';
    }

    // Confirm Matches
    if (!Validator.equals(data.password, data.password2)) {
        errors.password2 = 'Confirm password and password must match';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}