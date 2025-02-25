const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    developer: {
        type: String,
        require: true
    },
    release_date: {
        type: Date,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    back: {
        type: String,
        require: true
    },
    cover: {
        type: String,
        require: true
    },
    source: {
        name: {
            type: String,
            require: true
        },
        link: {
            type: String,
            require: true
        }
    }
})

module.exports = mongoose.model("Games", gameSchema);