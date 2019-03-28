const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const key = require('../../config/keys').secret;
const passport = require('passport');

// Load input validations
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

// Load User Model
const User = require('../../models/User');

/**
 * @route GET api/users/register
 * @desc Register User / Saving it to the Database
 * @access Public
 */
router.post('/register', (req, res) => {
    const {
        errors,
        isValid
    } = validateRegisterInput(req.body);

    // Check validations
    if (!isValid) {
        return res.status(400).json(errors);
    }

    // Find the unique Email address
    User.findOne({
        email: req.body.email
    }).then(user => {
        if (user) {
            // console.log('Hello');
            errors.email = 'Email already exists.';
            return res.status(400).json(errors);
        } else {
            let avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                default: 'mm'
            });
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            // Hash the password
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save().then(user => {
                        return res.json(user)
                    }).catch(err => {
                        console.log(err);
                    });
                });
            });
        }
    });
});


/**
 * @route GET api/users/login
 * @desc Login User / Sending the login Token back
 * @access Public
 */
router.post('/login', (req, res) => {
    const {
        errors,
        isValid
    } = validateLoginInput(req.body);

    // Check validations
    if (!isValid) {
        return res.status(400).json(errors);
    }

    const {
        email,
        password
    } = req.body;

    // Find the user by email
    User.findOne({
        email
    }).then(user => {
        if (!user) {
            errors.email = "User email is not registered.";
            return res.status(404).json(errors);
        }
        // Match the password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (isMatch) {
                // Now send the auth token back b generating it and sign it
                // JWT Payload
                const payload = {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar
                }
                jwt.sign(
                    payload,
                    key, {
                        expiresIn: 3600
                    }, (err, token) => {
                        res.json({
                            success: true,
                            token: `Bearer ${token}`,
                            message: "You are successfully logged in."
                        });
                    });
            } else {
                errors.password = 'Password incorrect'
                return res.status(400).json(errors);
            }
        });
    });
});

/**
 * @route GET api/users/profile
 * @desc Login User / Sending the login Token back
 * @access Private
 */
router.get('/profile', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    return res.json(req.user);
});

module.exports = router