const express = require('express')
const mongoose = require('mongoose')
const { create } = require('express-handlebars')
const path = require('path');

const { users, games, reviews } = require("./data.js");

console.clear();

const app = express();
const Review = require("./database/models/reviewModel");


const hbs = create({
    helpers: {
        equals(x, y) {
            return x === y;
        },

        pad(string, chars) {
            return string.padStart(chars, " ");
        },

        generateStarRating(stars, isEditable) {
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
                    if (stars === -1) { // for leaving a review, you can always "edit" the star rating
                        unclickable = "allow-editing-always";
                    }
                }
                if (i < stars) {
                    checked = "checked";
                }
                out += `<span ${id} ${onclick} class="fa fa-star ${unclickable} ${checked}"></span>`;
            }
            return out;
        },

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

        findUser(username) {
            let user = users.find(user => user.username === username);
            return user;
        }
    },
    extname: ".hbs",
    defaultLayout: "main"
});

app.engine('hbs', hbs.engine);
app.set("view engine", "hbs");
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded( {extended: true}));

mongoose.connect("mongodb://127.0.0.1:27017/reviewapp");

app.get('/', async (req, res) => {
    res.render("index", { "title": "Main Page", "games": games.sort((game1, game2) => game2.rating - game1.rating) });
})

app.get('/reviews', async (req, res) => {
    let title = req.query.game;
    res.render("reviews", {
        "title": title,
        "game": games.find(game => game.title === title),
        "reviews": reviews.filter(review => review.game === title).sort((review1, review2) => review2.upvotes - review1.upvotes)
    });
})

app.get('/review', async (req, res) => {
    let username = req.query.user;
    let gameTitle = req.query.game;
    let user = users.find(user => user.username === username);

    /*Mongodb Approach */
    const review2 = await Review.findOne({game: gameTitle}, {}, {username: username}, {}).lean();
    res.render("review", { "title": review2.title, "review": review2, "user": user });

    /*Non Mongodb approach */
    // let review = reviews.find(review => review.username === username && review.game === gameTitle);
    // res.render("review", { "title": review.title, "review": review, "user": user });

})

app.get('/profile', async (req, res) => {

    let username = req.query.user;
    let user = users.find(user => user.username === username);
    res.render("profile", {
        "title": username,
        "username": username,
        "user": user,
        "reviews": reviews.filter(review => review.username === username).sort((review1, review2) => review2.upvotes - review1.upvotes)
    });
})

app.get('/register', async (req, res) => {
    res.render("register");
})

app.get('/users', async (req, res) => {
    res.render("users", {
        "title": "Users", "users": users.sort((user1, user2) => user1.username.localeCompare(user2.username))
    })
})

app.post('/submit-review', async (req, res) => {
    /* Tentative before we include Login */
    const username = "416"

    Review.create({
        game: req.body.game,
        title: req.body.title,
        username: username,
        date: Date.now(),
        rating: 0,
        upvotes: 0,
        text: req.body.text,
        developer_response: "",
    });

    const review = await Review.findOne({game: req.body.game}, {}, {username: username}, {}).lean();

    if (!review) {
        return res.status(404).send("Review not found.");
    }

    console.log("Review found:", review);
    
    res.redirect(`/review?user=${username}&game=${req.body.game}`);
});


const PORT = 3000;
app.listen(PORT, () => {
    console.log("Handlebars app is running on http://localhost:3000")
})