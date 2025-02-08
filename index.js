const express = require('express')
const mongoose = require('mongoose')
const { create } = require('express-handlebars')
const path = require('path');

const app = express();

const hbs = create({
    helpers: {
        generateStarRating(stars) {
            return '<span class="fa fa-star checked"></span>'.repeat(stars)
                + '<span class="fa fa-star unchecked"></span>'.repeat(5 - stars);
        },

        truncateWords(text, wordCount) {
            let splitText = text.split(" ").splice(0, wordCount).join(" ");
            splitText.trimEnd(",");
            let lastCharacter;
            let lastCharacterIsPunctuation;
            do {
                lastCharacter = splitText.slice(-1);
                lastCharacterIsPunctuation = lastCharacter == ',';
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
app.use(express.static('public'));

mongoose.connect("mongodb://127.0.0.1:27017/reviewapp");

app.get('/', async (req, res) => {
    res.render("index", {"games": games});
})

app.get('/register', async(req, res) => {
    res.render("register")
})


const PORT = 3000;
app.listen(PORT, () => {
    console.log("Handlebars app is running on http://localhost:3000")
})

var users = [
    {
        username: "lowy",
        subtitle: "Gacha addict",
        avatar: "18.png",
        description: "Gacha addict・Draws sometimes・Inaantok pero ayaw matulog・飛ぶにゃん♪・学マス/Blue Archive(Asia)/プリコネ/ヘブバン/FGO(NA)",
        lastSeen: "Online",
        accountAge: "2 years",
        favoriteGame: "Gakuen Idolmaster"
    },
    {
        username: "wafl",
        subtitle: "Zenshoku zenshin, Yousoro!",
        avatar: "5.png",
        description: "Together, we can show the world what we can do!",
        lastSeen: "Online",
        accountAge: "1 years",
        favoriteGame: "Super Mario World"
    },
    {
        username: "mainFrog",
        subtitle: "FrogCritic site owner and admin",
        avatar: "24.png",
        description: "greninja",
        lastSeen: "1 years, 2 months ago",
        accountAge: "3 years",
        favoriteGame: "Girls' Frontline"
    },
    {
        username: "Roymer",
        subtitle: ":mew:",
        avatar: "29.png",
        description: "I'm Roemer I check my inbox pretty frequently, so feel free to send something! Good morning. Order for Roemer? No, not Robert, swap the B with an M. Also, there is no T. No it's not Romer, it's like Ro-E-mer. No, it's not Roymer. There is an E. Yeah it's before the M. No, replace the Y with an E. No, that's still not it... Yeah.... Here, let me just show you my ID...",
        lastSeen: "4 years, 5 months ago",
        accountAge: "6 years",
        favoriteGame: "Robotek"
    },
    {
        username: "pow",
        subtitle: "•_•",
        avatar: "13.png",
        description: "",
        lastSeen: "Online",
        accountAge: "10 years",
        favoriteGame: "FL Studio"
    },
    {
        username: "cgkghj",
        subtitle: "average elation enjoyer",
        avatar: "1.png",
        description: "Yes, I picked this username on purpose",
        lastSeen: "1 week ago",
        accountAge: "3 months",
        favoriteGame: "Minecraft"
    }
]

var games = [
    {
        title: "Super Mario Bros.",
        rating: 5,
        developer: "Nintendo",
        release_date: "1989",
        description: "Plumber brothers Mario and Luigi from Brooklyn have just arrived in an outlandish realm called the Mushroom Kingdom. It was ruled by Princess Toadstool and her faithful Mushroom people. But one day, evil cast a shadow over the land and the evil King Bowser Koopa emerged with his army of Goombas, Spinies, Flying Koopas, and other malignant creatures. King Koopa abducted Princess Toadstool and trapped her faithful Mushroom People in seven of his castles. So Mario and Luigi must intrepid deep and hazardous waters, jump from tree to tree (don’t look down!), and visually examine their steps in the dark evil castles filled with fire balls and lava pits and must utilize their magic powers to subjugate the evil King Koopa and rescue the Princess.",
        file: "Super Mario Bros. (World)",
        source: {
            name: "IMDb",
            link: "https://www.imdb.com/title/tt0177266/"
        }
    },
    {
        title: "Pac-Man",
        rating: 4,
        developer: "Namco",
        release_date: "1993",
        description: "Players guide a yellow, pie-shaped creature around a single maze, munching dots while avoiding four roaming ghosts. Four energizer dots are on the board, one in each corner. Eating one of these special dots will temporarily empower Pac-Man to turn the tables on the ghosts. Each time all the dots in a maze are eaten, play resumes with a fresh screen.",
        file: "Pac-Man (USA) (Namco)",
        source: {
            name: "IMDb",
            link: "https://www.imdb.com/title/tt0260264/"
        },
    },
    {
        title: "Pokémon: Red Version",
        rating: 4,
        developer: "GameFreak",
        release_date: "1998",
        description: "Ash is a young trainer traveling around the Pokemon world with his partner Pikachu. He is joined by his friends to help aid him in his journey. His ultimate goal is to become a Pokemon Master, which he will not stop training and working hard to achieve.",
        file: "Pokemon - Red Version (USA, Europe) (SGB Enhanced)",
        source: {
            name: "IMDb",
            link: "https://www.imdb.com/title/tt0217733/"
        }
    },
    {
        title: "EarthBound",
        rating: 5,
        developer: "ConcernedApe",
        release_date: "1994",
        description: "One night a large meteor crashes to the earth. A young boy named Ness goes out to investigate, and discovers that he and three other kids are destined to save the earth from an alien leader called Giygas, who is going to destroy the world.",
        file: "EarthBound (USA)",
        source: {
            name: "IMDb",
            link: "https://www.imdb.com/title/tt0208332/"
        }
    },
    {
        title: "Fire Emblem: Seisen no Keifu",
        rating: 4,
        developer: "Intelligent Systems",
        release_date: "1996",
        description: "On the continent of Judgral, eight kingdoms launch a war against the other in a power-struggle to control the continent. When Sigurd, the prince of the Duchy of Calphy, and his army becomes involved in the war, their actions will forever change the continent in a game that takes place across two generations as Sigurd's son, Seliph, must set things right when his father meets a violent end and Judgral is left in ruins in what many regard as the Fire Emblem series' darkest installment.",
        file: "Fire Emblem - Seisen no Keifu (Japan)",
        source: {
            name: "IMDb",
            link: "https://www.imdb.com/title/tt7468122/"
        }
    }
]

var reviews = [
    {
        game: "Super Mario Bros.",
        title: "Mario, the Idea vs. Mario, the Man",
        username: "lowy",
        date: "March 10, 2024",
        rating: 4,
        upvotes: 12,
        text: "Everyone knows Mario is cool. But who knows what he's thinking? Who knows why he crushes turtles? And why do we think about him as fondly as we think of the mystical (nonexistent?) Dr Pepper? Perchance. I believe it was Kant who said \"Experience without theory is blind, but theory without experience is mere intellectual play.\" Mario exhibits experience by crushing turts all day, but he exhibits theory by stating \"Lets-a go!\" Keep it up, baby! When Mario leaves his place of safety to stomp a turty, he knows that he may Die. And yet, for a man who can purchase lives with money, a life becomes a mere store of value. A tax that can be paid for, much as a rich man feels any law with a fine is a price. We think of Mario as a hero,but he is simply a one percenter of a more privileged variety. The lifekind. Perchance.",
        developer_response: "You can't just say perchance."
    },
    {
        game: "Super Mario Bros.",
        title: "The super game of all time",
        username: "wafl",
        date: "January 8, 2025",
        rating: 5,
        upvotes: 310,
        text: "This is super!"
    },
    {
        game: "Super Mario Bros.",
        title: "I didn't feel powerful enough",
        username: "pow",
        date: "June 9, 1987",
        rating: 3,
        upvotes: 20,
        text: "It was fun, but I didn't really feel powerful after finishing the game; I just felt like I had finally gotten rid of a nuisance."
    },
    {
        game: "Super Mario Bros.",
        title: "A good game for roaming",
        username: "Roymer",
        date: "June 2, 1987",
        rating: 5,
        upvotes: 23,
        text: "I was able to roam around a lot in this game; so I think this is a nice game."
    },
    {
        game: "Super Mario Bros.",
        title: "A good game for hopping",
        username: "mainFrog",
        date: "June 2, 1987",
        rating: 5,
        upvotes: 69,
        text: "I was able to hop around a lot in this game; so I think this is a nice game."
    },
    {
        game: "Pac-Man",
        title: "An arcade classic, ported",
        username: "wafl",
        date: "July 9, 1993",
        rating: 5,
        upvotes: 100,
        text: "Ever since Pac-Man chomped his way through the arcades, he's become a worldwide star. His latest rendezvous to the Nintendo Entertainment System is just one of his many showstopping successes!"
    },
    {
        game: "Pac-Man",
        title: "Absolute garbage",
        username: "lowy",
        date: "July 10, 1993",
        rating: -0,
        upvotes: -100,
        text: "No BGM, confusing story, the ghosts move weirdly."
    }
]