const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const passport = require('passport');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');


/**
 * @route GET api/profile/
 * @desc Get current user's profile
 * @access Private
 */
router.get('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const errors = {};
    // fetch the current user's profile
    Profile.findOne({
        user: req.user._id
    }).populate('user', ['name', 'avatar']).then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for this user.';
            return res.status(404).json(errors)
        } else {
            return res.status(200).json(profile)
        }
    }).catch(err => res.status(404).json(err));
});

/**
 * @route GET api/profile/all
 * @desc Get all profiles
 * @access Public
 */
router.get('/all', (req, res) => {
    const errors = {};
    Profile.find()
        .populate('user', ['name', 'avatar'])
        .then(profiles => {
            if (!profiles) {
                errors.noprofiles = "There are no profiles available on this platform."
                return res.status(404).json(errors);
            }
            return res.status(200).json(profiles);
        }).catch(err => res.status(404).json(err));
});

/**
 * @route POST api/profile/handle/:handle
 * @desc Get Profile by handle
 * @access Public
 */
router.get('/handle/:handle', (req, res) => {
    const errors = {};

    Profile.findOne({
        handle: req.params.handle
    }).populate('user', ['name', 'avatar']).then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
        }
        return res.json(profile);
    }).catch(err => res.status(404).json(err));
});

/**
 * @route POST api/profile/user/:user
 * @desc Get Profile by user ID
 * @access Public
 */
router.get('/user/:id', (req, res) => {
    const errors = {};

    Profile.findOne({
        user: req.params.id
    }).populate('user', ['name', 'avatar']).then(profile => {
        if (!profile) {
            errors.noprofile = 'There is no profile for this user';
            return res.status(404).json(errors);
        }
        return res.json(profile);
    }).catch(err => res.status(404).json(err));
});


/**
 * @route POST api/profile/
 * @desc Create/Edit the user profile
 * @access Private
 */
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateProfileInput(req.body);

    // Check validation
    if (!isValid) {
        // Return any errors with 400 status
        return res.status(400).json(errors);
    }

    // get fields
    const profileFields = {};
    profileFields.user = req.user._id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername) profileFields.githubusername = req.body.githubusername;

    // Skills - Split into array
    if (typeof req.body.skills !== 'undefined') {
        profileFields.skills = req.body.skills.split(',')
    }

    // Social Links
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;

    Profile.findOne({
            user: req.user._id
        })
        .then(profile => {
            if (profile) {
                // update
                Profile.findOneAndUpdate({
                    user: req.user._id
                }, {
                    $set: profileFields
                }, {
                    new: true
                }).then(profile => {
                    return res.json(profile);
                });
            } else {
                // Create new profile

                // Check if the handle exists
                Profile.findOne({
                    handle: profileFields.handle
                }).then(profile => {
                    if (profile) {
                        errors.handle = 'That handle already exists.';
                        return res.status(400).json(errors)
                    }
                    // save new profile
                    new Profile(profileFields).save().then(profle => res.status(200).json(profile));
                });
            }
        });
});

/**
 * @route POST api/profile/experiance
 * @desc Add experience to profile
 * @access Private
 */
router.post('/experience', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateExperienceInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({
        user: req.user._id
    }).then(profile => {
        let {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body;

        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        };

        // Add to the profile
        profile.experience.unshift(newExp);
        profile.save().then(profile => res.json(profile));
    });
});

/**
 * @route POST api/profile/education
 * @desc Add education to profile
 * @access Private
 */
router.post('/education', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validateEducationInput(req.body);

    // Check validation
    if (!isValid) {
        return res.status(400).json(errors);
    }

    Profile.findOne({
        user: req.user._id
    }).then(profile => {
        let {
            school,
            degree,
            fieldofstudy,
            from,
            current,
            description
        } = req.body;

        const newEdu = {
            school,
            degree,
            fieldofstudy,
            from,
            current,
            description
        };

        // Add to the profile
        profile.education.unshift(newEdu);
        profile.save().then(profile => res.json(profile));
    });
});

/**
 * @route DELETE api/profile/experience/:id
 * @desc DELETE Experiance
 * @access Private
 */
router.delete('/experience/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
        user: req.user._id
    }).then(profile => {
        // Get remove index
        const removeIndex = profile.experience
            .map(exp => exp._id)
            .indexOf(req.params.id);

        // Splice out of the array
        profile.experience.splice(removeIndex, 1);
        profile.save().then(profile => res.status(200).json(profile));
    }).catch(err => res.status(404).json(err));
});

/**
 * @route DELETE api/profile/education/:id
 * @desc DELETE Education
 * @access Private
 */
router.delete('/education/:id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOne({
        user: req.user._id
    }).then(profile => {
        // Get remove index
        const removeIndex = profile.education
            .map(edu => edu._id)
            .indexOf(req.params.id);

        // Splice out of the array
        profile.education.splice(removeIndex, 1);
        profile.save().then(profile => res.status(200).json(profile));
    }).catch(err => res.status(404).json(err));
});

/**
 * @route DELETE api/profile/education/:id
 * @desc DELETE Education
 * @access Private
 */
router.delete('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile.findOneAndRemove({
            user: req.user._id
        })
        .then(() => {
            User.findOneAndRemove({
                    _id: req.user._id
                })
                .then(() => res.json({
                    success: true
                }));
        });
});




module.exports = router