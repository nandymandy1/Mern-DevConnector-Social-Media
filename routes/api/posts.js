const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profile");
const Post = require("../../models/Post");
const validatePostInput = require("../../validation/post");

/**
 * @route POST api/posts/
 * @description Create new Post
 * @access Private
 */
router.post(
    "/",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const {
            errors,
            isValid
        } = validatePostInput(req.body);
        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        let {
            name,
            avatar,
            text
        } = req.body;
        const newPost = new Post({
                name,
                avatar,
                text,
                user: req.user._id
            })
            .save()
            .then(post => res.status(200).json(post))
            .catch(err => res.status(400).json(err));
    }
);

/**
 * @route GET api/posts/
 * @description Get all posts
 * @access Public
 */
router.get("/", (req, res) => {
    Post.find()
        .sort({
            date: -1
        })
        .then(posts => {
            return res.status(200).json(posts);
        })
        .catch(err =>
            res.status(400).json({
                nopost: "No posts found."
            })
        );
});

/**
 * @route GET api/posts/:id
 * @description Get single post by id
 * @access Public
 */
router.get("/:id", (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            return res.status(200).json(post);
        })
        .catch(err =>
            res.status(400).json({
                nopost: "No post found with that id."
            })
        );
});

/**
 * @route DELETE api/posts/:id
 * @description Delete single post by id
 * @access Private
 */
router.delete(
    "/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
                user: req.user._id
            })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        if (post.user.toString() !== req.user.id) {
                            return res.status(401).json({
                                notauthorized: "You are not authorized."
                            });
                        }
                        // delete
                        post.remove().then(() =>
                            res.json({
                                success: true
                            })
                        );
                    })
                    .catch(err =>
                        res.status(400).json({
                            nopost: "No post found"
                        })
                    );
            })
            .catch(err =>
                res.status(400).json({
                    nopost: "No post found"
                })
            );
    }
);

// @route   POST api/posts/like/:id
// @desc    Like post
// @access  Private
router.post(
    '/like/:id',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (
                        post.likes.filter(like => like.user.toString() === req.user.id)
                        .length > 0
                    ) {
                        return res
                            .status(400)
                            .json({
                                alreadyliked: 'User already liked this post'
                            });
                    }

                    // Add user id to likes array
                    post.likes.unshift({
                        user: req.user.id
                    });

                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({
                    postnotfound: 'No post found'
                }));
        });
    }
);

/**
 * @route POST api/posts/unlike/:id
 * @description Unlike Post by id
 * @access Private
 */
router.post(
    '/unlike/:id',
    passport.authenticate('jwt', {
        session: false
    }),
    (req, res) => {
        Profile.findOne({
            user: req.user.id
        }).then(profile => {
            Post.findById(req.params.id)
                .then(post => {
                    if (
                        post.likes.filter(like => like.user.toString() === req.user.id)
                        .length === 0
                    ) {
                        return res
                            .status(400)
                            .json({
                                notliked: 'You have not yet liked this post'
                            });
                    }

                    // Get remove index
                    const removeIndex = post.likes
                        .map(item => item.user.toString())
                        .indexOf(req.user.id);

                    // Splice out of array
                    post.likes.splice(removeIndex, 1);

                    // Save
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({
                    postnotfound: 'No post found'
                }));
        });
    }
);

/**
 * @route POST api/posts/comment/:id
 * @description Comment on Post by id
 * @access Private
 */
router.post(
    "/comment/:id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {
        const {
            errors,
            isValid
        } = validatePostInput(req.body);
        // Check Validation
        if (!isValid) {
            return res.status(400).json(errors);
        }
        Post.findById(req.params.id)
            .then(post => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.user._id
                };
                // Push it into comments array
                post.comments.unshift(newComment);
                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(400).json(err));
    }
);

/**
 * @route Delete api/posts/comment/:id
 * @description Delete Comment on Post by id and comment id
 * @access Private
 */
router.delete(
    "/comment/:id/:com_id",
    passport.authenticate("jwt", {
        session: false
    }),
    (req, res) => {

        Post.findById(req.params.id)
            .then(post => {

                // Check to see if the comment exists
                if (post.comments
                    .filter(comment => comment._id.toString() === req.params.com_id)
                    .length === 0) {
                    return res.status(404).json({
                        commentnotexists: 'Comment does not exists.'
                    });
                }

                // Get remove index
                const removeIndex = post.comments
                    .map(comment => comment._id.toString())
                    .indexOf(req.params.com_id);

                // Splice comment out of array
                post.comments.splice(removeIndex, 1);
                post.save().then(post => res.json(post));
            })
            .catch(err => res.status(400).json(err));
    });

module.exports = router;