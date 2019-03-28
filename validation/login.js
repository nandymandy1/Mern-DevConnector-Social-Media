const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateLoginInput(data) {
    let errors = {};

    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';


    // Check for valid the Email
    if (!Validator.isEmail(data.email)) {
        errors.email = 'Email is invalid';
    }
    // Check for the Password
    if (Validator.isEmpty(data.password)) {
        errors.password = 'Password field is required';
    }

    // Check for the Email
    if (Validator.isEmpty(data.email)) {
        errors.email = 'Email field is required';
    }
    // Check for the Password length
    if (!Validator.isLength(data.password, {
            min: 6,
            max: 20
        })) {
        errors.password = 'Password must atleast 6 characters.';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}