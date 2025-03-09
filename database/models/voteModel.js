const mongoose = require('mongoose');

const voteSchema = mongoose.Schema({
    reviewId: {
        type: String,
        require: true
    },
    vote: {
        type: Number,
        require: true,
    },
    userId: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Vote', voteSchema);