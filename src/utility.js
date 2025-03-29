const Review = require("../database/models/reviewModel");
const User = require("../database/models/userModel");
const Game = require("../database/models/gameModel");
const Vote = require("../database/models/voteModel");

async function countVotes(reviewId) {
    try {
        const upvoteCount = await Vote.countDocuments({ reviewId: reviewId, vote: 1 });
        const downvoteCount = await Vote.countDocuments({ reviewId: reviewId, vote: 0 });

        return upvoteCount - downvoteCount;
    } catch (error) {
        console.error("Error in Vote Count", error);
        return -1;
    }
}

async function getReviewCounts() {
    // SELECT game AS _id, COUNT(*) AS reviewCount FROM reviews GROUP BY game
    let out = {};
    await Review.aggregate().sortByCount("game").then(result => {
        result.forEach(entry => {
            out[entry._id] = entry.count;
        })
    });
    return out
}

let averageStarRatings = {};
getAverageStarRatings().then(result => averageStarRatings = result);

let reviewCounts = {};
getReviewCounts().then(result => reviewCounts = result);

// Sorting helpers

const gameByRating = (game1, game2) => averageStarRatings[game2.title] - averageStarRatings[game1.title];
const reviewByUpvotes = (review1, review2) => review2.upvotes - review1.upvotes;
const userByName = (user1, user2) => user1.username.localeCompare(user2.username);

module.exports = this;