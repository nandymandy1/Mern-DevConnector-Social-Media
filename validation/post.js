const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validatePostInput(data) {
    let errors = {};

    data.text = !isEmpty(data.text) ? data.text : '';
    console.log(data);
    // Check for the Text length
    if (!Validator.isLength(data.text, {
            min: 10,
            max: 300
        })) {
        errors.text = 'Text must atleast 10 characters.';
    }

    // Check for the Text
    if (Validator.isEmpty(data.text)) {
        errors.text = 'Text field is required';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    };
};