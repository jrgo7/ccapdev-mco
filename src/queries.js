// Common MongoDB queries
const Review = require("../database/models/reviewModel");
const User = require("../database/models/userModel");
const Game = require("../database/models/gameModel");
const Vote = require("../database/models/voteModel");

async function getAverageRatings() {
    return await Review.aggregate(
        [{
            '$group': {
                '_id': '$game',
                'averageRating': { '$avg': '$rating' }
            }
        }, {
            '$sort': {
                averageRating: -1
            }
        }]
    );
}

async function getAverageRating(gameTitle) {
    let averageRatings = await getAverageRatings();
    let averageRatingEntry = averageRatings.find(
        entry => entry.id === gameTitle
    );
    if (averageRatingEntry) {
        return averageRatingEntry.averageRating;
    } else {
        return 0;
    }
}

async function getReviewCounts() {
    return await Review.aggregate().sortByCount("game");
}

async function getReviewCount(gameTitle) {
    let reviewCounts = await getReviewCounts();
    let reviewCountEntry = reviewCounts.find(
        entry => entry.id === gameTitle
    );
    if (reviewCountEntry) {
        return reviewCountEntry.count;
    } else {
        return 0;
    }
}

async function getVoteCount(reviewId) {
    const upvoteCount = await Vote.countDocuments({ reviewId: reviewId, vote: 1 });
    const downvoteCount = await Vote.countDocuments({ reviewId: reviewId, vote: 0 });
    return upvoteCount - downvoteCount;
}

module.exports = {
    getAverageRatings, getAverageRating,
    getReviewCounts, getReviewCount,
    getVoteCount
};