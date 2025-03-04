const express = require('express')
const mongoose = require('mongoose')
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { create } = require('express-handlebars')
const fileUpload = require('express-fileupload')
const path = require('path');

const { users, games } = require("./data.js");

const app = express();
const Review = require("./database/models/reviewModel");
const User = require("./database/models/userModel");
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
                dev_email: game.dev_email,
                title: game.title,
                developer: game.developer,
                release_date: Date(game.date),
                description: game.description,
                back: `${game.file}.png`,
                cover: `${game.file}.png`,
                source: {
                    name: game.source.name,
                    link: game.source.link
                }
            }
        )
    })
}

async function resetExistingUsers() {
    const emailsToDelete = [
        "416@hk.com",
        "main@frog.com",
        "lowest@low.com",
        "wafl@rain.com",
        "roymer@roemer.com",
        "pow@cc.com",
        "cgk@ghj.com",
        "mario@mail.com"
    ];

    await User.deleteMany({ email: { $in: emailsToDelete } });
    
    users.forEach(user => {
        User.create(
            {
                email: user.email,    
                password: user.password,
                username: user.username,
                subtitle: user.subtitle,
                avatar: user.avatar,
                description: user.description,
                lastSeen: user.lastSeen,
                accountCreateDate: user.accountCreateDate,
                favoriteGame: user.favoriteGame
            }
        )
    })
}

resetGames();
resetExistingUsers();

const hbs = create({
    helpers: {

        defaultAvatar: function (avatar) {
            return avatar ? `img/avatar/${avatar}` : "img/avatar/guest.png";
        },

        equals(x, y) {
            return x === y;
        },

        /**
         * @param {Date} date 
         */
        formatDate(date) {
            return date.toLocaleDateString('en-us', {
                year: "numeric",
                month: "short",
                day: "numeric"
            })
        },

        // Using normal `equals()` would compare the references instead of the actual values
        dateEquals(d1, d2) {
            return d1.getTime() === d2.getTime();
        },

        isNow(date){
            const now = new Date();
            return date.toDateString() === now.toDateString();
        },
        
        accountAge(date) {
            const now = new Date();
            const diffTime = now - date;
        
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
            const diffMonths = Math.floor(diffDays / 30); // Approximate months
            const diffYears = Math.floor(diffDays / 365); // Approximate years
        
            if (diffYears > 0) {
                return `${diffYears} year${diffYears === 1 ? "" : "s"}`;
            } else if (diffMonths > 0) {
                return `${diffMonths} month${diffMonths === 1 ? "" : "s"}`;
            } else if (diffDays > 0) {
                return `${diffDays} day${diffDays === 1 ? "" : "s"}`;
            } else {
                return "Less than a day";
            }
        },

        async findUser(email) {
            const user = await User.findOne({ email: email }).lean(); 
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
        }
    },
    extname: ".hbs",
    defaultLayout: "main"
});

app.engine('hbs', hbs.engine);
app.set("view engine", "hbs");
app.use(fileUpload());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(
    session(
        {
            secret: "secret-key",
            resave: false,
            saveUninitialized: false,
        }
    )
);

mongoose.connect("mongodb://127.0.0.1:27017/reviewapp");

// Sorting helpers

const gameByRating = (game1, game2) => game2.rating - game1.rating;
const reviewByUpvotes = (review1, review2) => review2.upvotes - review1.upvotes;
const userByName = (user1, user2) => user1.username.localeCompare(user2.username);


//Checks if a user is logged in
const isAuthenticated = (req,res,next) => {
    if (req.session.user){
        next();
    }
    else{
        res.redirect("/register");
    }
}

//Middleware to pass user automatically
app.use((req, res, next) => {
    res.locals.loggedUser = req.session.user;
    next();
});

// GET routes

app.get('/', async (req, res) => {
    const games = await Game.find({ }).lean();
    res.render("index", { "title": "Main Page", "games": games } );
})

app.get('/reviews', async (req, res) => {
    let title = req.query.game;
    
    const game = await Game.findOne({title: title}).lean();

    res.render("reviews", {
        "title": title,
        "game": game,
        "reviews": (await Review.find({ game: title }).lean()).sort(reviewByUpvotes)
    });
})

app.get('/review', async (req, res) => {
    let id = req.query.id;

    const review = await Review.findOne({ _id: id }).lean();
    const user = await User.findOne({email: review.email }).lean();

    res.render("review", { "title": review.title, "review": review, "user": user});

})

app.get('/selfprofile', isAuthenticated, async (req, res) => {
    res.redirect(`/profile?user=${req.session.user.username}`)
});

app.get('/profile', async (req, res) => {
    let username = req.query.user;
    const user = await User.findOne({ username: username}).lean();
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
    const allUsers = await User.find({}).lean();
    console.log(allUsers);
    res.render("users", {
        "title": "Users", "users": allUsers
    })
})

app.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("sessionID");
        res.redirect("/")
    })
})

// POST routes

app.post('/submit-review', async (req, res) => {
    console.log(req.body);
    const email = req.session.user.email;
    const game = req.body.game;

    // If updating an exisitng record, update the edit date
    // ? This is done separately from the second `updateOne` statement below
    // ? because in the case where we insert a new record,
    // ? the edit_date would be milliseconds later than the default post_date.
    await Review.updateOne(
        {
            // "WHERE"
            email: email,
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
            email: email,
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

    const review = await Review.findOne({ game: game, email: email }).lean();

    if (!review) {
        return res.status(404).send("Review not found.");
    }

    console.log("Review found:", review);

    res.redirect(`/review?id=${review._id}`);
});

app.post("/login", async (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email }).lean();

        if (!user) {
            return res.status(401).send("Invalid email.");
        }

        if (user.password !== password) {
            return res.status(401).send("Invalid email or password.");
        }

        req.session.user = user; 
        res.cookie("sessionID", req.sessionID);

        await User.updateOne(
            {
                email: email
            },
            {
                $set: {
                    lastSeen: Date.now()
                }
            }
        );
        
        res.redirect("/"); 
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).send("An error occurred. Please try again.");
    }
})

app.post("/register", async (req,res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const conf_password = req.body.conf_password;

    try {
        const user = await User.findOne({ email: email }).lean();

        if (user) {
            return res.status(401).send("Email is in use");
        } else if (password !== conf_password) {
            return res.send("Passwords dont match");
        }

        await User.create({
            email: email,    
            password: password,
            username: username,
            subtitle: "",
            avatar: "",
            description: "",
            lastSeen: Date.now(),
            accountCreateDate: Date.now(),
            favoriteGame: ""
        })

        req.session.user = await User.findOne({ email: email }).lean();
        res.cookie("sessionID", req.sessionID);

        res.redirect("/"); 
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).send("An error occurred. Please try again.");
    }
})

app.post('/save-game', async (req, res) => {
    const { title, developer, releaseDate, description } = req.body;
    const { boxart, wallpaper } = req.files ?? {};

    const game = await Game.findOne({ title: title });
    //Store previous file names
    let imgPaths = { boxart: game.cover, wallpaper: game.back };

    if (boxart) {
        const boxartPath = path.resolve(__dirname, 'public/img/cover/', boxart.name);
        await boxart.mv(boxartPath);
        //TODO DELETE PREVIOUS FILE
        imgPaths.boxart = boxart.name;
    }

    if (wallpaper) {
        const wallpaperPath = path.resolve(__dirname, 'public/img/back/', wallpaper.name);
        await wallpaper.mv(wallpaperPath);
        //TODO DELETE PREVIOUS FILE
        imgPaths.wallpaper = wallpaper.name;
    }

    await Game.updateOne(
        { title: title },
        {
            $set: {
                developer: developer,
                release_date: releaseDate,
                description: description,
                cover: imgPaths.boxart, 
                back: imgPaths.wallpaper,
            },
        }
    );

    res.json({ success: true, message: "Game updated successfully" });
});


app.post('/save-profile', async (req, res) => {
    const { username, subtitle, description, favorite } = req.body;
    const { profile } = req.files ?? {};

    let updatedProfile = req.session.user.avatar;

    if (profile) {
        const profilePath = path.resolve(__dirname, 'public/img/avatar/', profile.name);
        await profile.mv(profilePath);
        //TODO DELETE PREVIOUS FILE
        updatedProfile = profile.name;
    }

    const result = await User.updateOne(
        { email: req.session.user.email },
        {
            $set: {
                username: username,
                subtitle: subtitle,
                favoriteGame: favorite,
                description: description,
                avatar: updatedProfile,
            }
        }
    );
    res.json({ success: true, message: "Profile updated successfully" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Handlebars app is running on http://localhost:3000")
})