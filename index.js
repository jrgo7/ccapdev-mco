// NPM modules
const express = require('express')
const session = require("express-session");
const cookieParser = require("cookie-parser");
const mongoConnect = require("connect-mongo");
const fileUpload = require('express-fileupload');
const fs = require('fs').promises;
const path = require('path')
const favicon = require('serve-favicon');
const dotenv = require('dotenv')

// MCO Modules
const hbs = require('./src/hbs.js'); // handlebars instance
const connect = require('./database/connect.js'); // mongodb atlas connection
// - routes
const gameRoutes = require('./src/routes/games.js');
const reviewRoutes = require('./src/routes/reviews.js');
const userRoutes = require('./src/routes/users.js');
const voteRoutes = require('./src/routes/votes.js');
const otherRoutes = require('./src/routes/other.js');

async function main() {
    console.clear();
    console.log('====[STARTING SERVER]====');
    dotenv.config();
    const app = express();

    app.engine('hbs', hbs.engine);
    app.set("view engine", "hbs");

    // Middlewares
    // - for misc. purposes
    app.use(favicon(path.resolve(__dirname, 'public/img/favicon.ico')))
    app.use(fileUpload());
    app.use(express.static('public'));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json()); // - for body parsing
    // - for session handling
    app.use(
        session(
            {
                secret: "secret-key",
                resave: false,
                saveUninitialized: false,
                store: mongoConnect.create({
                    mongoUrl: process.env.MONGO_URI
                }),
                cookie: {
                    secure: false
                }
            }
        )
    );
    // Pass user automatically
    app.use((req, res, next) => {
        res.locals.loggedUser = req.session.user;
        next();
    });
     // route splitting
    app.use(gameRoutes);
    app.use(reviewRoutes);
    app.use(userRoutes);
    app.use(voteRoutes);
    app.use(otherRoutes);
    // ---

    const PORT = 3000;
    app.listen(PORT, () => {
        try {
            connect();
            console.log("MongoDB connection successful!");
    
        } catch (err) {
            console.log("MongoDB connection unsuccessful...");
            console.error(err);
        }
        console.log("Handlebars app is running on http://localhost:3000")
    })
}

main();