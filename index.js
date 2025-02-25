const express = require('express')
const mongoose = require('mongoose')
const { create } = require('express-handlebars')
const path = require('path');

const { users, games } = require("./data.js");

const app = express();
const Review = require("./database/models/reviewModel");
const Game = require("./database/models/gameModel");

console.clear();

/**
 *  Retrieve game data from `data.js`
 */
async function resetGames() {
    await Game.deleteMany({});
    games.forEach(game => {
        Game.create(
            {
                title: game.title,
                developer: game.developer,
                release_date: Date(game.date),
                description: game.description,
                back: `img/back/boxart/${game.file}.png`,
                cover: `img/cover/boxart/${game.file}.png`,
                source: {
                    name: game.source.name,
                    link: game.source.link
                }
            }
        )
    })
  }

resetGames();

const hbs = create({
    helpers: {
        equals(x, y) {
            return x === y;
        },

        // Using normal `equals()` would compare the references instead of the actual values
        dateEquals(d1, d2) {
            return d1.getTime() === d2.getTime();
        },

        findUser(username) {
            let user = users.find(user => user.username === username);
            return user;
        },

        pad(string, chars) {
            return string.padStart(chars, " ");
        },

        /**
         * @param {Number} rating 
         * @param {Boolean} isEditable 
         * @returns Text containing a series of `<span>` elements representing the star rating
         *          If the star rating is editable, a list of IDs in the format `star-n` is also added.
         */
        generateStarRating(rating, isEditable) {
            let out = "";
            for (i = 1; i <= 5; i++) {
                let checked = "unchecked";
                let onclick = "";
                let unclickable = "";
                let id = "";
                if (isEditable) {
                    onclick = `onclick=setStarRating(${i})`
                    id = `id=star-${i}`;
                    unclickable = "unclickable";
                    if (rating === -1) { // for leaving a review, you can always "edit" the star rating
                        unclickable = "allow-editing-always";
                    }
                }
                if (i <= rating) {
                    checked = "checked";
                }
                out += `<span ${id} ${onclick} class="fa fa-star ${unclickable} ${checked}"></span>`;
            }
            return out;
        },

        /**
         * @param {String} text 
         * @param {Number} wordCount
         * @returns A trimmed version of `text` having only the specified `wordCount`, with "..." appended if the original length exceeds it
         */
        truncateWords(text, wordCount) {
            let splitText = text.split(" ").splice(0, wordCount).join(" ");
            splitText.trimEnd(",");
            let lastCharacter;
            let lastCharacterIsPunctuation;
            do {
                lastCharacter = splitText.slice(-1);
                lastCharacterIsPunctuation = lastCharacter === ',';
                if (lastCharacterIsPunctuation) {
                    splitText = splitText.substring(0, splitText.length - 1);
                }
            } while (lastCharacterIsPunctuation);
            if (splitText != text) {
                splitText += "...";
            }
            return splitText;
        },

        /**
         * 
         * @param {Date} date 
         */
        formatDate(date) {
            return date.toLocaleDateString('en-us', {
                year: "numeric",
                month: "short",
                day: "numeric"
            })
        }
    },
    extname: ".hbs",
    defaultLayout: "main"
});

app.engine('hbs', hbs.engine);
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/reviewapp");

// Sorting helpers

const gameByRating = (game1, game2) => game2.rating - game1.rating;
const reviewByUpvotes = (review1, review2) => review2.upvotes - review1.upvotes;
const userByName = (user1, user2) => user1.username.localeCompare(user2.username);

// GET routes

app.get('/', async (req, res) => {
    res.render("index", { "title": "Main Page", "games": games.sort(gameByRating) });
})

app.get('/reviews', async (req, res) => {
    let title = req.query.game;

    res.render("reviews", {
        "title": title,
        "game": games.find(game => game.title === title),
        "reviews": (await Review.find({ game: title }).lean()).sort(reviewByUpvotes)
    });
})

app.get('/review', async (req, res) => {
    let username = req.query.user;
    let gameTitle = req.query.game;
    let user = users.find(user => user.username === username);

    const review = await Review.findOne({ game: gameTitle, username: username }, {}).lean();
    res.render("review", { "title": review.title, "review": review, "user": user });

})

app.get('/profile', async (req, res) => {

    let username = req.query.user;
    let user = users.find(user => user.username === username);
    res.render("profile", {
        "title": username,
        "username": username,
        "user": user,
        "reviews": (await Review.find({ username: username }).lean()).sort(reviewByUpvotes)
    });
})

app.get('/register', async (req, res) => {
    res.render("register");
})

app.get('/users', async (req, res) => {
    res.render("users", {
        "title": "Users", "users": users.sort(userByName)
    })
})

// POST routes

app.post('/submit-review', async (req, res) => {
    console.log(req.body);
    const username = req.body.username;
    const game = req.body.game;

    // If updating an exisitng record, update the edit date
    // ? This is done separately from the second `updateOne` statement below
    // ? because in the case where we insert a new record,
    // ? the edit_date would be milliseconds later than the default post_date.
    await Review.updateOne(
        {
            // "WHERE"
            username: username, // ! WILL BE DYNAMIC IN MCO3
            game: game
        },
        {
            // "SET"
            $set: {
                edit_date: Date.now()
            }
        }
    )

    await Review.updateOne(
        {
            // "WHERE"
            username: username, // ! WILL BE DYNAMIC IN MCO3
            game: game
        },
        {
            // "SET"
            $set: {
                title: req.body.title,
                rating: Number(req.body.rating),
                text: req.body.text,
            }
        },
        {
            // If no matching review found, create it (also setting the username and game)
            // "update or insert"
            upsert: true
        }
    )

    const review = await Review.findOne({ game: game, username: username }).lean();

    if (!review) {
        return res.status(404).send("Review not found.");
    }

    console.log("Review found:", review);

    res.redirect(`/review?user=${username}&game=${game}`);
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log("Handlebars app is running on http://localhost:3000")
})