const mongoose = require('mongoose');

const voteSchema = mongoose.Schema({
    reviewId: {
        type: String,
        require: true
    },
    vote: { // 0 for DISLIKE/DOWNVOTE, 1 FOR LIKE/UPVOTE
        type: Number,
        require: true,
    },
    userId: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Vote', voteSchema);