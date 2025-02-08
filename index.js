const express = require('express')
const mongoose = require('mongoose')
const { engine } = require('express-handlebars')
const path = require('path');

const app = express();

app.engine('hbs', engine({extname: ".hbs", defaultLayout: "main"}))
app.set("view engine", "hbs");
app.use(express.static('public'));

mongoose.connect("mongodb://127.0.0.1:27017/reviewapp")

app.get('/', async(req, res) => {
    res.render("index")
})

app.get('/register', async(req, res) => {
    res.render("register")
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log("Handlebars app is running on http://localhost:3000")
} )