const express = require('express')
const mongoose = require('mongoose')
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { create } = require('express-handlebars')
const fileUpload = require('express-fileupload')
const path = require('path');
const favicon = require('serve-favicon');

const { users, games } = require("./database/data.js");

const app = express();
app.use(favicon(path.resolve(__dirname, 'public/img/favicon.ico')))

const Review = require("./database/models/reviewModel");
const User = require("./database/models/userModel");
const Game = require("./database/models/gameModel");
const Vote = require("./database/models/voteModel");

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
                release_date: game.release_date,
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

/**
 * @returns JSON in the format of { game1Title: averageRating }
 * @note This is an async function, so use the `.then(result => ... )` pattern
 */
async function getAverageStarRatings() {
    // SELECT game AS _id, AVG(rating) AS averageRating FROM reviews GROUP BY game
    let out = {};
    await Review.aggregate(
        [
            {
                $group: {
                    _id: "$game",
                    averageRating: { $avg: "$rating" }
                }
            },
            {
                $sort: {
                    averageRating: -1
                }
            }
        ]
    ).then(result => {
        result.forEach(entry => {
            // Format as 0-2 decimal places (1 -> 1; 1.2 -> 1.2; 1.23 -> 1.23; 1.23456 -> 1.23)
            // by fixing the number of decimal places to 2
            // and then parsing the resulting string as a float
            out[entry._id] = parseFloat(entry.averageRating.toFixed(2));
        })
    });
    return out
}

async function countVotes(reviewId) {
    try {
        const upvoteCount = await Vote.countDocuments({ reviewId: reviewId, vote: 1 });
        const downvoteCount = await Vote.countDocuments({ reviewId: reviewId, vote: 0 });

        return upvoteCount - downvoteCount;
    } catch (error) {
        console.error("Error in Vote Count", error);
        return -1;
    }

}

async function getReviewCounts() {
    // SELECT game AS _id, COUNT(*) AS reviewCount FROM reviews GROUP BY game
    let out = {};
    await Review.aggregate().sortByCount("game").then(result => {
        result.forEach(entry => {
            out[entry._id] = entry.count;
        })
    });
    return out
}

resetGames();
resetExistingUsers();

let averageStarRatings = {};
getAverageStarRatings().then(result => averageStarRatings = result);

let reviewCounts = {};
getReviewCounts().then(result => reviewCounts = result)

const pluralS = amount => amount === 1 ? "" : "s";

const hbs = create({
    helpers: {

        defaultAvatar: function (avatar) {
            return avatar ? `img/avatar/${avatar}` : "img/avatar/guest.png";
        },

        castNumber(x) {
            return Number(x);
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

        formatDateYear(date) {
            return date.toLocaleDateString('en-us', {
                year: "numeric"
            })
        },

        getTime(date) {
            return date.getTime();
        },

        // Using normal `equals()` would compare the references instead of the actual values
        dateEquals(d1, d2) {
            return d1.getTime() === d2.getTime();
        },

        isNow(date) {
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
                return `${diffYears} year${pluralS(diffYears)}`;
            } else if (diffMonths > 0) {
                return `${diffMonths} month${pluralS(diffMonths)}`;
            } else if (diffDays > 0) {
                return `${diffDays} day${pluralS(diffDays)}`;
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
                // Stars are by default:
                let checked = "unchecked"; // unchecked
                let onclick = ""; // have no bound click events
                let clickable = ""; // are unclickable
                let id = ""; // and have no id
                if (isEditable) { // but if it is part of an editable star rating (i.e., in leave review modal)
                    onclick = `onclick=setStarRating(${i})` // add a function on click
                    id = `id=star-${i}`; // set a unique ID for this star to identify it (when toggling the `checked` CSS class)
                    clickable = "allow-editing-always"; // and always make it editable/"clickable"
                }
                if (i <= rating) {
                    checked = "checked";
                }
                out += `<span ${id} ${onclick} class="fa fa-star fa-xl ${clickable} ${checked}"></span>`;
            }
            return out;
        },

        getAverageStarRating(gameTitle) {
            return averageStarRatings[gameTitle] || 0;
        },

        getRoundedAverageStarRating(gameTitle) {
            return Math.round(averageStarRatings[gameTitle]) || 0;
        },

        getReviewCount(gameTitle) {
            return reviewCounts[gameTitle] || 0;
        },

        getReviewCountFormatted(gameTitle) {
            let count = reviewCounts[gameTitle] || 0
            return `${count} review${pluralS(count)}`
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

const gameByRating = (game1, game2) => averageStarRatings[game2.title] - averageStarRatings[game1.title];
const reviewByUpvotes = (review1, review2) => review2.upvotes - review1.upvotes;
const userByName = (user1, user2) => user1.username.localeCompare(user2.username);


// Checks if a user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    }
    else {
        res.redirect("/register");
    }
}

// Middleware to pass user automatically
app.use((req, res, next) => {
    res.locals.loggedUser = req.session.user;
    next();
});

// * GET routes

app.get('/', async (req, res) => {
    const games = (await Game.find({}).lean()).sort(gameByRating);
    res.render("index", { "title": "Main Page", "games": games });
})

app.get('/reviews', async (req, res) => {
    let title = req.query.game;

    let page = req.query.page ?? 1; // 1-indexed page number
    const reviewsPerPage = 4;

    // ? Use Review.countDocuments() in getReviewCount helper?
    const reviewCount = await Review.countDocuments({ game: title });

    const pageCount = Math.ceil(reviewCount / reviewsPerPage);

    const reviews = await Review.aggregate([
        {
            "$match": {
                "game": title
            }
        },
        {
            "$skip": reviewsPerPage * (page - 1)
        },
        {
            "$limit": reviewsPerPage
        }
    ]);

    const game = await Game.findOne({ title: title }).lean();
    const users = await User.find({}).lean();

    const userLookup = users.reduce((acc, user) => {
        acc[user.email] = user;
        return acc;
    }, {});

    let existingReviewId;
    if (req.session.user) {
        let existingReview = await Review.findOne({ game: title, email: req.session.user.email }).lean();
        if (existingReview != null) {
            existingReviewId = existingReview._id;
        }
    }

    for (let i = 0; i < reviews.length; i++) {
        reviews[i].votes = await countVotes(reviews[i]._id)
    }

    res.render("reviews", {
        "title": title,
        "game": game,
        "reviews": (reviews).sort(reviewByUpvotes),
        "users": userLookup,
        "existingReviewId": existingReviewId || false,
        "page": page,
        "pages": new Array(pageCount).keys().map(index => index + 1),
        "error": req.query.error ?? null // Error notification
    });
})

app.get('/review', async (req, res) => {
    let id = req.query.id;

    const review = await Review.findOne({ _id: id }).lean();
    const user = await User.findOne({ email: review.email }).lean();
    const game = await Game.findOne({ title: review.game }).lean();
    const dev = await User.findOne({ email: game.dev_email}).lean();
    const voteCount = await countVotes(id);

    let upvote = false;
    let downvote = false;

    if (req.session.user) {
        upvote = await Vote.findOne({ userId: req.session.user._id, vote: 1, reviewId: review._id });
        downvote = await Vote.findOne({ userId: req.session.user._id, vote: 0, reviewId: review._id });
    }

    res.render("review", { "title": review.title, "review": review, "user": user, "game": game, "voteCount": voteCount, "upvote": upvote, "downvote": downvote, "dev": dev });
})

app.get('/selfprofile', isAuthenticated, async (req, res) => {
    res.redirect(`/profile?user=${req.session.user._id}`)
});

app.get('/profile', async (req, res) => {
    let id = req.query.user;
    const user = await User.findOne({ _id: id }).lean();
    res.render("profile", {
        "title": user.username,
        "username": user.username,
        "user": user,
        "reviews": (await Review.find({ email: user.email }).lean()).sort(reviewByUpvotes)
    });
})

app.get('/register', async (req, res) => {
    res.render("register", {
        "title": "Register"
    });
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

// * POST routes

app.post('/submit-review', isAuthenticated, async (req, res) => {
    console.log(req.body);
    const email = req.session.user.email;
    const game = req.body.game;

    // If the user is the developer of the game, stop
    const gameEntry = await Game.findOne({title: game});
    console.log(`DEV EMAIL IS ${gameEntry.dev_email}`);
    console.log(email);
    if (gameEntry.dev_email === email) {
        res.redirect(`/reviews?game=${game}&error=You cannot review this game because you developed it.`);
        return;
    }

    const findParams = {
        email: email,
        game: game
    };

    const setParams = {
        title: req.body.title,
        rating: Number(req.body.rating),
        text: req.body.text,
    };

    if (req.files) {
        let { media } = req.files;
        await media.mv(path.resolve(__dirname, 'public/img/review-attachment/', media.name));
        mediaType = media.mimetype.startsWith('image/') ? "image" : "video";
        setParams.attachment = { "type": mediaType, "filename": media.name };
    }

    // ! MongoDB upsert caused issues with syncing edit and post timestamps
    let foundReview = await Review.findOne(findParams)
    if (foundReview) {
        await Review.updateOne(findParams, {
            $set: {
                ...setParams,
                edit_date: Date.now() // update edit date
            }
        })
    } else {
        foundReview = await Review.create({
            ...findParams, // add email and game as attributes
            ...setParams,
        });
    }

    // Update average star ratings and review counts
    getAverageStarRatings().then(result => averageStarRatings = result)
    getReviewCounts().then(result => reviewCounts = result)

    if (!foundReview) {
        return res.status(404).send(
            `An existing review was not found for { email: "${email}", game: "${game}" } and a new one could not be made. This should never happen unless the Review model was not initialized correctly.`
        );
    }

    res.redirect(`/review?id=${foundReview._id}`);
});

app.post('/submit-response', isAuthenticated, async(req, res) => {
    console.log(req.body);
    const currentuser = req.session.user.email;
    const dev = req.body.dev;
    const game = await Game.findOne({dev_email: dev});
    let review = await Review.findOne({_id: req.body.rev})
    
    if (currentuser !== game.dev_email) {
        return;
    }

    console.log(review)

    if (review.developer_response.text !== "") {
        await Review.updateOne( {'_id': req.body.rev }, {
            $set: {
                "developer_response.text": req.body.text,
                "developer_response.edit_date": Date.now()
            }
        })
    } else {
        await Review.updateOne({'_id': req.body.rev }, {
            $set: {
                "developer_response.text": req.body.text,
                "developer_response.post_date": Date.now()
            }
        })
    }
    review = await Review.findOne({_id: req.body.rev})
    console.log(review);
    res.redirect(`/review?id=${review._id}`);
})

app.post('/delete-response', isAuthenticated, async (req, res) => {
    let rev = req.body.response;
    console.log(rev)
    await Review.updateOne({'_id': req.body.response }, {
        $set: {
            "developer_response.text": "",
            "developer_response.post_date": null,
            "developer_response.edit_date": null,
        }
    })

    let review = await Review.findOne({_id: req.body.response})
    console.log(review)
    res.redirect(`/review?id=${review._id}`);
})

app.post('/delete-review', isAuthenticated, async (req, res) => {
    let deletedReview = await Review.findOneAndDelete({ _id: req.body.reviewId });
    let deletedReviewGame = deletedReview.game;
    console.log(`>>>Redirecting to /reviews?game=${deletedReviewGame}...`)

    getAverageStarRatings().then(result => averageStarRatings = result)
    getReviewCounts().then(result => reviewCounts = result)

    res.redirect(`/reviews?game=${deletedReviewGame}`);
})

app.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        const user = await User.findOne({ email: email }).lean();

        if (!user || user.password !== password) {
            const games = await Game.find({}).lean();
            return res.status(401).render(
                "index", {
                "title": "Main Page",
                "games": games,
                "error": "Invalid login credentials."
            });
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
        const games = await Game.find({}).lean();
        res.status(500).render("index", { "title": "Main Page", "games": games, "error": error }
        );
    }
})

app.post('/upvote', isAuthenticated, async (req, res) => {

    const upvote = await Vote.findOne({ 'userId': req.session.user._id, 'reviewId': req.body.reviewId }).lean();

    if (upvote) {
        await Vote.findOneAndDelete({ 'userId': req.session.user._id, 'reviewId': req.body.reviewId });

        res.json({ refresh: true });
    } else {
        await Vote.findOneAndDelete({ 'userId': req.session.user._id, 'reviewId': req.body.reviewId });

        await Vote.create({
            userId: req.session.user._id,
            reviewId: req.body.reviewId,
            vote: 1
        })

        res.json({ refresh: true });
    }
})

app.post('/downvote', isAuthenticated, async (req, res) => {
    console.log(req.body);

    const downvote = await Vote.findOne({ 'userId': req.session.user._id, 'reviewId': req.body.reviewId }).lean();

    if (downvote) {
        await Vote.findOneAndDelete({ 'userId': req.session.user._id, 'reviewId': req.body.reviewId });

        res.json({ refresh: true });
    } else {
        await Vote.create({
            userId: req.session.user._id,
            reviewId: req.body.reviewId,
            vote: 0
        })

        res.json({ refresh: true });
    }
})

app.post("/register", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const conf_password = req.body.conf_password;
    const terms = req.body.terms;
    const description = req.body.description;
    
    let profile;

    if (req.files) {
        const { avatar } = req.files;
        await avatar.mv(path.resolve(__dirname, 'public/img/avatar/', avatar.name));

        profile = avatar.name;
    }

    try {
        const user = await User.findOne({ email: email }).lean();

        if (user) {
            return res.render("register", {
                title: "Register",
                error: "Email is in use"
            });
        } else if (password !== conf_password) {
            return res.render("register", {
                title: "Register",
                error: "Passwords don't match"
            });
        } else if(!terms){
            return res.render("register", {
                title: "Register",
                error: "Please read and accept the terms and conditions"
            });
        }

        await User.create({
            email: email,
            password: password,
            username: username,
            subtitle: "",
            avatar: profile,
            description: description,
            lastSeen: Date.now(),
            accountCreateDate: Date.now(),
            favoriteGame: ""
        })

        req.session.user = await User.findOne({ email: email }).lean();
        res.cookie("sessionID", req.sessionID);

        res.redirect("/");
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).render("register", {
            title: "Register",
            error: "An error occurred. Please try again."
        });
    }
})

app.post('/save-game', isAuthenticated, async (req, res) => {
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

    res.json({ success: true, refresh: true, message: "Game updated successfully" });
});


app.post('/save-profile', isAuthenticated, async (req, res) => {
    const { username, subtitle, description, favorite } = req.body;
    const { profile } = req.files ?? {};

    let updatedProfile = req.session.user.avatar;

    if (profile) {
        const profilePath = path.resolve(__dirname, 'public/img/avatar/', profile.name);
        await profile.mv(profilePath);
        //TODO DELETE PREVIOUS FILE
        updatedProfile = profile.name;
    }

    req.session.user = await User.findOneAndUpdate(
        { email: req.session.user.email },
        {
            $set: {
                username: username,
                subtitle: subtitle,
                favoriteGame: favorite,
                description: description,
                avatar: updatedProfile,
            }
        },
        { new: true }
    );

    res.json({ success: true, refresh: true, message: "Profile updated successfully" });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log("Handlebars app is running on http://localhost:3000")
})
