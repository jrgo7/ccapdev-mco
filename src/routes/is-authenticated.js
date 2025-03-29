// Checks if a user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        next();
    }
    else {
        res.redirect("/register");
    }
}

module.exports = isAuthenticated;