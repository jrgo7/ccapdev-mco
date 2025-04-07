// NPM Modules
const { Router } = require('express');

// MCO3 Modules
const isAuthenticated = require("./is-authenticated.js");
const Game = require("../../database/models/gameModel");
const queries = require('../queries.js');

const router = Router();

// * GET routes
router.get('/', async (req, res) => {
    let averageRatings = await queries.getAverageRatings();
    let reviewCounts = await queries.getReviewCounts();
    let error = req.query.error ?? null;
    let games = (await Game.find({}).sort('title').lean());
    games = games.map((game) => {
            let averageRating = averageRatings.find(entry => entry._id == game.title);
            if (averageRating) {
                game.averageRating = averageRating.averageRating
            } else {
                game.averageRating = 0;
            }
            let reviewCount = reviewCounts.find(entry => entry._id == game.title);
            if (reviewCount) {
                game.reviewCount = reviewCount.count;
            } else {
                game.reviewCount = 0;
            }
            return game
        }
    );
    res.render("index", { "title": "Main Page", "games": games, "error": error });
});

// * POST routes

router.post('/save-game', isAuthenticated, async (req, res) => {
    const { title, developer, releaseDate, description, boxart, wallpaper } = req.body;

    const game = await Game.findOne({ title: title });
    //Store previous file urls
    let imgPaths = { boxart: game.cover, wallpaper: game.back };

    if (boxart) {
        imgPaths.boxart = boxart;
    }

    if (wallpaper) {
        imgPaths.wallpaper = wallpaper;
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

module.exports = router;