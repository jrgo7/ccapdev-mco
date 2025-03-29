// NPM Modules
const { Router } = require('express');

// MCO3 Modules
const isAuthenticated = require("./is-authenticated.js");
const Review = require("../../database/models/reviewModel");
const User = require("../../database/models/userModel");
const Game = require("../../database/models/gameModel");
const Vote = require("../../database/models/voteModel");

const router = Router();

const reviewsPerPage = 4;

// * GET

router.get('/reviews', async (req, res) => {
    let title = req.query.game;

    let page = req.query.page ?? 1; // 1-indexed page number

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

router.get('/review', async (req, res) => {
    let id = req.query.id;

    const review = await Review.findOne({ _id: id }).lean();
    const user = await User.findOne({ email: review.email }).lean();
    const game = await Game.findOne({ title: review.game }).lean();
    const dev = await User.findOne({ email: game.dev_email }).lean();
    const voteCount = await countVotes(id);

    let upvote = false;
    let downvote = false;

    if (req.session.user) {
        upvote = await Vote.findOne({ userId: req.session.user._id, vote: 1, reviewId: review._id });
        downvote = await Vote.findOne({ userId: req.session.user._id, vote: 0, reviewId: review._id });
    }

    res.render("review", { "title": review.title, "review": review, "user": user, "game": game, "voteCount": voteCount, "upvote": upvote, "downvote": downvote, "dev": dev });
})

// * POST

router.post('/submit-review', isAuthenticated, async (req, res) => {
    console.log(req.body);
    const email = req.session.user.email;
    const game = req.body.game;

    // If the user is the developer of the game, stop
    const gameEntry = await Game.findOne({ title: game });
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
        if (setParams.attachment && foundReview.attachment) {
            await fs.unlink(path.resolve(__dirname, 'public/img/review-attachment/', foundReview.attachment.filename));
        }
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

router.post('/submit-response', isAuthenticated, async (req, res) => {
    console.log(req.body);
    const currentuser = req.session.user.email;
    const dev = req.body.dev;
    const game = await Game.findOne({ dev_email: dev });
    let review = await Review.findOne({ _id: req.body.rev })

    if (currentuser !== game.dev_email) {
        return;
    }

    console.log(review)

    if (review.developer_response.text !== "") {
        await Review.updateOne({ '_id': req.body.rev }, {
            $set: {
                "developer_response.text": req.body.text,
                "developer_response.edit_date": Date.now()
            }
        })
    } else {
        await Review.updateOne({ '_id': req.body.rev }, {
            $set: {
                "developer_response.text": req.body.text,
                "developer_response.post_date": Date.now(),
                "developer_response.edit_date": Date.now()
            }
        })
    }
    review = await Review.findOne({ _id: req.body.rev })
    console.log(review);
    res.redirect(`/review?id=${review._id}`);
})

router.post('/delete-response', isAuthenticated, async (req, res) => {
    let rev = req.body.response;
    console.log(rev)
    await Review.updateOne({ '_id': req.body.response }, {
        $set: {
            "developer_response.text": "",
            "developer_response.post_date": null,
            "developer_response.edit_date": null,
        }
    })

    let review = await Review.findOne({ _id: req.body.response })
    console.log(review)
    res.redirect(`/review?id=${review._id}`);
})

router.post('/delete-review', isAuthenticated, async (req, res) => {
    let deletedReview = await Review.findOneAndDelete({ _id: req.body.reviewId });
    let deletedReviewGame = deletedReview.game;
    console.log(`>>>Redirecting to /reviews?game=${deletedReviewGame}...`)

    getAverageStarRatings().then(result => averageStarRatings = result)
    getReviewCounts().then(result => reviewCounts = result)

    res.redirect(`/reviews?game=${deletedReviewGame}`);
})

module.exports = router;