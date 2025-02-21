const mongoose = require('mongoose')

const gameSchema = mongoose.Schema({
    title:{
        type: String,
        require: true
    },
    rating:{
        type: int,
        require: true
    },
    developer:{
        type: String,
        require: true
    },
    release_date:{
        type: Date,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    image:{
        type: String,
        require: true
    },
    source_name: {
        type: String,
        require: true
    },
    source_link: {
        type: String,
        require: true
    }
})

model.exports = mongoose.model("Games", gameSchema);