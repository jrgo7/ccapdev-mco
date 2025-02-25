const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    game:{
        type: String,
        require: true
    },
    title:{
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true
    },
    date:{
        type: Date,
        require: true
    },
    rating:{
        type: Number,
        require: true
    },
    upvotes: {
        type: Number,
        require: true
    },
    text: {
        type: String,
        require: true
    },
    attachment: {
        type: {
            type: String,
            require: true
        },
        filename: {
            type: String,
            require: true
        }
    },
    developer_response: {
        type: String,
        require: true
    }
})
        /*
        game: "Super Mario Bros.",
        title: "Mario, the Idea vs. Mario, the Man",
        username: "lowy",
        date: "March 10, 2024",
        rating: 4,
        upvotes: 12,
        text: "Everyone knows Mario is cool. But who knows what he's thinking? Who knows why he crushes turtles? And why do we think about him as fondly as we think of the mystical (nonexistent?) Dr Pepper? Perchance. I believe it was Kant who said \"Experience without theory is blind, but theory without experience is mere intellectual play.\" Mario exhibits experience by crushing turts all day, but he exhibits theory by stating \"Lets-a go!\" Keep it up, baby! When Mario leaves his place of safety to stomp a turty, he knows that he may Die. And yet, for a man who can purchase lives with money, a life becomes a mere store of value. A tax that can be paid for, much as a rich man feels any law with a fine is a price. We think of Mario as a hero,but he is simply a one percenter of a more privileged export constiety. The lifekind. Perchance.",
        attachment: {
            type: "image",
            filename: "mario.png"
        },
        developer_response: "You can't just say perchance."
        */

module.exports = mongoose.model('Reviews', reviewSchema);