const users = [
    {
        username: "LowestOfTheLow",
        subtitle: "Gacha addict",
        avatar: "18.png",
        description: "Gacha addict・Draws sometimes・Inaantok pero ayaw matulog・飛ぶにゃん♪・学マス/Blue Archive(Asia)/プリコネ/ヘブバン/FGO(NA)",
        lastSeen: "6 years, 9 months ago",
        accountAge: "12 years"
    },
    {
        username: "waflrain",
        subtitle: "Zenshoku zenshin, Yousoro!",
        avatar: "16.png"
    },
    {
        username: "mainFrog",
        subtitle: "FrogCritic site owner and admin",
        avatar: "1.png"
    },
    {
        username: "roymer",
        subtitle: ":mew:",
        avatar: "2.png",
        description: "I'm Roemer I check my inbox pretty frequently, so feel free to send something! Good morning. Order for Roemer? No, not Robert, swap the B with an M. Also, there is no T. No it's not Romer, it's like Ro-E-mer. No, it's not Roymer. There is an E. Yeah it's before the M. No, replace the Y with an E. No, that's still not it... Yeah.... Here, let me just show you my ID..."
    },
    {
        username: "pow",
        subtitle: "•_•",
        avatar: "3.png",
    }
]

const games = [
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
        },
        reviews: [
            {
                title: "Mario, the Idea vs. Mario, the Man",
                username: "LowestOfTheLow",
                date: "March 10, 2024",
                rating: 4,
                upvotes: 12,
                text: "Everyone knows Mario is cool. But who knows what he's thinking? Who knows why he crushes turtles? And why do we think about him as fondly as we think of the mystical (nonexistent?) Dr Pepper? Perchance. I believe it was Kant who said \"Experience without theory is blind, but theory without experience is mere intellectual play.\" Mario exhibits experience by crushing turts all day, but he exhibits theory by stating \"Lets-a go!\" Keep it up, baby! When Mario leaves his place of safety to stomp a turty, he knows that he may Die. And yet, for a man who can purchase lives with money, a life becomes a mere store of value. A tax that can be paid for, much as a rich man feels any law with a fine is a price. We think of Mario as a hero,but he is simply a one percenter of a more privileged variety. The lifekind. Perchance."
            },
            {
                title: "The super game of all time",
                username: "waflrain",
                date: "January 8, 2025",
                rating: 5,
                upvotes: 310,
                text: "This is super!"
            },
            {
                title: "I didn't feel powerful enough",
                username: "pow",
                date: "June 9, 1987",
                rating: 3,
                upvotes: 20,
                text: "It was fun, but I didn't really feel powerful after finishing the game; I just felt like I had finally gotten rid of a nuisance."
            }
        ]
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
        reviews: [
            {
                title: "An arcade classic, ported",
                username: "waflrain",
                date: "July 9, 1993",
                rating: 5,
                upvotes: 100,
                text: "Ever since Pac-Man chomped his way through the arcades, he's become a worldwide star. His latest rendezvous to the Nintendo Entertainment System is just one of his many showstopping successes!"
            },
            {
                title: "Absolute garbage",
                username: "LowestOfTheLow",
                date: "July 10, 1993",
                rating: -0,
                upvotes: -100,
                text: "No BGM, confusing story, the ghosts move weirdly."
            }
        ]
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
        title: "Fire Emblem: Genealogy of the Holy War",
        rating: 4,
        developer: "Intelligent Systems",
        release_date: "1996",
        description: "On the continent of Judgral, eight kingdoms launch a war against the other in a power-struggle to control the continent. When Sigurd, the prince of the Duchy of Calphy, and his army becomes involved in the war, their actions will forever change the continent in a game that takes place across two generations as Sigurd's son, Seliph, must set things right when his father meets a violent end and Judgral is left in ruins in what many regard as the Fire Emblem series' darkest installment.",
        file: "Fire Emblem - Seisen no Keifu (Japan)",
        source: {
            name: "IMDb",
            link: "https://www.imdb.com/title/tt7468122/"
        }
    },
]

function truncateNoCutoff(text, wordCount) {
    splitText = text.split(" ").splice(0, wordCount).join(" ");
    splitText.trimEnd(",");
    let lastCharacter;
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

function generateStarRating(stars) {
    return '<span class="fa fa-star checked"></span>'.repeat(stars)
        + '<span class="fa fa-star"></span>'.repeat(5 - stars);
}

// Index

function addGameEntry(game) {
    /**
     * Add a game entry inside the `game-entries` container.
     * @param {game} - The game entry to add
     */
    var template = `
        <div class="game index-game-entry bg-white">
            <a class="index-game-cover-container" href="reviews.html?title=${game.title}">
                <img class="index-game-cover d-block mx-auto my-auto" src="img/cover/${game.file}.png">
            </a>
            <div class="mx-5 my-5">
                <h2 class="fs-4 fw-bold">${game.title}</h2>
                <div class="star-rating">
                    ${generateStarRating(game.rating)}
                </div>
                <p class="fst-italic">
                    ${game.developer}, ${game.release_date}
                </p>
                <p>
                    ${truncateNoCutoff(game.description, 20)}
                </p>
                <p class="fst-italic">
                    Source:
                    <a href="${game.source.link}">
                    ${game.source.name}
                    </a>
                </p>
            </div>
        </div>
        `;
    document.getElementById("game-entries").innerHTML += template;
}

// View Reviews

function addReview(review) {
    let user = users.find((user) => user.username == review.username);
    template = `
    <a class="block-link col-6" href="review.html">
                <div class="border rounded review">
                    <div class="star-rating">
                        ${generateStarRating(review.rating)}
                        <div class="votes">
                            <span class="fa fa-thumbs-up"></span>
                            ${review.upvotes}
                            <span class="fa fa-thumbs-down"></span>
                        </div>
                    </div>
                    <h3 class="fw-bold fs-4">${review.title}</h3>
                    <div class="review-info-text">
                        <p>
                            ${truncateNoCutoff(review.text, 3)}
                        </p>
                        <div class="reviewer-info">
                            <img class="avatar me-2" src="img/avatar/${user.avatar}">
                            <div class="author-date">
                                <p class="fw-bold reviewer-name">${review.username}</p>
                                <p class="fst-italic review-date">${review.date}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
    `;
    document.getElementById("reviews").innerHTML += template;
}

function showGameData(title) {
    let game = games.find((game) => game.title == title);
    let gameCover = document.getElementById("game-cover");
    let gameInfoContainer = document.getElementById("game-info-container");
    let gameTitle = document.getElementById("game-title");
    let gameDeveloperDate = document.getElementById("game-developer-date");
    let gameDescriptionText = document.getElementById("game-description-text");

    gameCover.src = "img/cover/" + game['file'] + '.png';
    gameInfoContainer.style.backgroundImage = `linear-gradient(rgba(255, 255, 255, 0.25),rgb(248, 249, 250)), url("/img/back/${game['file']}.png")`;
    gameTitle.innerText = game.title;
    gameDeveloperDate.innerText = `${game.developer}, ${game.release_date}`;
    gameDescriptionText.innerText = game['description'];

    game.reviews.forEach((review => {
        addReview(review);
    }));
}

url = document.URL;

if (url.endsWith('/')) { // is Index / Game List
    games.forEach(game => {
        addGameEntry(game);
    })
} else if (url.includes("reviews.html")) {
    let queryString = window.location.search;
    let title = new URLSearchParams(queryString).get("title");
    showGameData(title);
}