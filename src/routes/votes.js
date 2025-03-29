// NPM Modules
const { Router } = require('express');

// MCO3 Modules
const isAuthenticated = require("./is-authenticated.js");
const Vote = require("../../database/models/voteModel");

const router = Router();

router.post('/upvote', isAuthenticated, async (req, res) => {
    const upvote = await Vote.findOne({ 'userId': req.session.user._id, 'reviewId': req.body.reviewId }).lean();

    if (upvote) {
        await Vote.findOneAndDelete({ 'userId': req.session.user._id, 'reviewId': req.body.reviewId });

        res.json({ refresh: true });
    } else {
        await Vote.findOneAndDelete({ 'userId': req.session.user._id, 'reviewId': req.body.reviewId });

        await Vote.create({
            userId: req.session.user._id,
            reviewId: req.body.reviewId,
            vote: 1
        })

        res.json({ refresh: true });
    }
})

router.post('/downvote', isAuthenticated, async (req, res) => {
    console.log(req.body);

    const downvote = await Vote.findOne({ 'userId': req.session.user._id, 'reviewId': req.body.reviewId }).lean();

    if (downvote) {
        await Vote.findOneAndDelete({ 'userId': req.session.user._id, 'reviewId': req.body.reviewId });

        res.json({ refresh: true });
    } else {
        await Vote.create({
            userId: req.session.user._id,
            reviewId: req.body.reviewId,
            vote: 0
        })

        res.json({ refresh: true });
    }
})

module.exports = router;