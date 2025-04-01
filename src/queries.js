// Common MongoDB queries
const Review = require("../database/models/reviewModel");
const User = require("../database/models/userModel");
const Game = require("../database/models/gameModel");
const Vote = require("../database/models/voteModel");
const globals = require('./globals.js');

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
        entry => entry._id === gameTitle
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

async function getReviews(gameTitle, username, searchQuery, page) {
    let matchQuery;
    if (gameTitle != "null") {
        console.log(">>>Searching reviews by Game Title: " + gameTitle);
        matchQuery = {
            "$match": {
                "game": gameTitle,
                "title": {
                    "$regex": '.*' + searchQuery + '.*'
                }
            }
        }
    } else if (username != "null") {
        console.log(">>>Searching reviews by Username: " + username);
        let user = await User.findOne({username}).lean();
        console.log("   >>>Email: " + user.email);
        matchQuery = {
            "$match": {
                "email": user.email,
                "title": {
                    "$regex": '.*' + searchQuery + '.*'
                }
            }
        }
    }
    let reviews = await Review.aggregate([
        matchQuery,
        {
            "$skip": globals.reviewsPerPage * (page - 1)
        },
        {
            "$limit": globals.reviewsPerPage
        }
    ]);
    for (let i = 0; i < reviews.length; i++) {
        reviews[i].votes = await getVoteCount(reviews[i]._id);
        
        // TODO Can be optimized by storing previous results
        reviews[i].user = await User.findOne({email: reviews[i].email}).lean();
    }
    return reviews;
}

module.exports = {
    getAverageRatings, getAverageRating,
    getReviewCounts, getReviewCount,
    getReviews,
    getVoteCount
};