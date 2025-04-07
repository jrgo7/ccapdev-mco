// NPM Modules
const { Router } = require('express');

const router = Router();

router.get('/about', async (req, res) => {
    res.render('about', {'title': 'About'});
});

module.exports = router;