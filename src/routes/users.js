// NPM Modules
const { Router } = require('express');
const bcrypt = require('bcrypt');

// MCO3 Modules
const isAuthenticated = require("./is-authenticated.js");
const Review = require("../../database/models/reviewModel");
const User = require("../../database/models/userModel");
const Game = require("../../database/models/gameModel");
const globals = require('../globals.js');
const queries = require('../queries.js');

const router = Router();


router.get('/selfprofile', isAuthenticated, async (req, res) => {
    res.redirect(`/profile?user=${req.session.user._id}`)
});

router.get('/profile', async (req, res) => {
    let id = req.query.user;
    const user = await User.findOne({ _id: id }).lean();
    const reviewCount = await Review.countDocuments({ email: user.email });
    const pageCount = Math.ceil(reviewCount / globals.reviewsPerPage);
    let page = req.query.page ?? 1; // 1-indexed page number

    const users = await User.find({}).lean();
    const userLookup = users.reduce((acc, user) => {
        acc[user.email] = user;
        return acc;
    }, {});

    const reviews = await Review.aggregate([
        {
            "$match": {
                email: user.email
            }
        },
        {
            "$skip": globals.reviewsPerPage * (page - 1)
        },
        {
            "$limit": globals.reviewsPerPage
        }
    ]);

    // This is needed whenever we need to get the vote count for a review... could be improved on
    for (let i = 0; i < reviews.length; i++) {
        reviews[i].votes = await queries.getVoteCount(reviews[i]._id)
    }

    res.render("profile", {
        "title": user.username,
        "username": user.username,
        "user": user,
        "reviews": (reviews).sort(globals.sortReviewByVoteCount),
        "users": userLookup,

        "page": page,
        "pages": new Array(pageCount).keys().map(index => index + 1)
    });
})

router.get('/register', async (req, res) => {
    res.render("register", {
        "title": "Register"
    });
})

router.get('/users', async (req, res) => {
    const allUsers = await User.find({}).lean();
    console.log(allUsers);
    res.render("users", {
        "title": "Users", "users": allUsers
    })
})

router.get("/logout", (req, res) => {
    req.session.destroy(() => {
        res.clearCookie("sessionID");
        res.redirect("/")
    })
})

// * POST

router.post("/login", async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const remember = req.body.remember ? true : false;

    if (remember) {
        req.session.cookie.maxAge = 21 * 24 * 60 * 60 * 1000; // 3 weeks
      } else {
        req.session.cookie.maxAge = null;
      }

    try {
        console.log(email);
        console.log(password);
        const user = await User.findOne({ email }).lean();
        console.log(user);
        if (!user || !(await bcrypt.compare(password, user.password))) {
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

router.post("/change-password", async (req, res) => {
    const email = req.body.email;
    const newPassword = req.body.password;
    const confirm = req.body.password["pass-confirm"]

   if(newPassword === confirm){
    const user = await User.findOne({ email: email });
    user.password = newPassword;
    await user.save();
   }
   res.redirect(`/profile?user=${req.session.user._id}`)
})

router.post("/register", async (req, res) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const conf_password = req.body.conf_password;
    const terms = req.body.terms;
    const description = req.body.description;
    const profile = req.body.avatar;

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
        } else if (!terms) {
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
        console.log(req.body);
        const nonleaneduser = await User.findOne({ email: email });
        nonleaneduser.password = password;
        await nonleaneduser.save();
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

router.post('/save-profile', isAuthenticated, async (req, res) => {
    const { username, subtitle, description, favorite, profile } = req.body;

    let updatedProfile = req.session.user.avatar;

    if (profile) {
        updatedProfile = profile;
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

module.exports = router;