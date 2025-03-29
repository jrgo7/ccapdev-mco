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
    res.render("index", { "title": "Main Page", "games": games });
});

// * POST routes

router.post('/save-game', isAuthenticated, async (req, res) => {
    const { title, developer, releaseDate, description } = req.body;
    const { boxart, wallpaper } = req.files ?? {};

    const game = await Game.findOne({ title: title });
    //Store previous file names
    let imgPaths = { boxart: game.cover, wallpaper: game.back };

    if (boxart) {
        const boxartPath = path.resolve(__dirname, 'public/img/cover/', boxart.name);
        await boxart.mv(boxartPath);
        //TODO DELETE PREVIOUS FILE
        if (imgPaths.boxart) {
            await fs.unlink(path.resolve(__dirname, 'public/img/cover/', imgPaths.boxart));
        }
        imgPaths.boxart = boxart.name;
    }

    if (wallpaper) {
        const wallpaperPath = path.resolve(__dirname, 'public/img/back/', wallpaper.name);
        await wallpaper.mv(wallpaperPath);
        //TODO DELETE PREVIOUS FILE
        if (imgPaths.wallpaper) {
            await fs.unlink(path.resolve(__dirname, 'public/img/back/', imgPaths.wallpaper));
        }
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

module.exports = router;