const express = require('express')
const mongoose = require('mongoose')
const { create } = require('express-handlebars')
const path = require('path');

const { users, games, reviews } = require("./data.js");

console.clear();

const app = express();

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
app.use(express.static('public'));

// mongoose.connect("mongodb://127.0.0.1:27017/reviewapp");

app.get('/', async (req, res) => {
    res.render("index", { "title": "Main Page", "games": games });
})

app.get('/reviews', async (req, res) => {
    let title = req.query.game;
    
    res.render("reviews", {
        "title": title,
        "game": games.find(game => game.title === title),
        "reviews": reviews.filter(review => review.game === title),
    });
})

app.get('/review', async (req, res) => {
    let username = req.query.user;
    let gameTitle = req.query.game;
    let review = reviews.find(review => review.username === username && review.game === gameTitle);
    let user = users.find(user => user.username === username);
    res.render("review", { "title": review.title, "review": review, "user": user });
})

app.get('/profile', async (req, res) => {
    
    let username = req.query.user;
    let user = users.find(user => user.username === username);
    console.log("Searching for " + username + " and found " + user);
    res.render("profile", {
        "title": username,
        "username": username,
        "user": user,
        "reviews": reviews.filter(review => review.username === username)
    });
})

app.get('/register', async (req, res) => {
    
    res.render("register");
})

app.get('/users', async (req, res) => {
    
    const updatedUsers = users.map(user => ({
        ...user,
        "isOnline": user.lastSeen.toLowerCase() === "online"
    }));

    res.render("users", { "title": "Users", "users": updatedUsers })
})


const PORT = 3000;
app.listen(PORT, () => {
    
    console.log("Handlebars app is running on http://localhost:3000")
})