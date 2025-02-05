const users = [
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
    },
]

const reviews = [
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

function truncateNoCutoff(text, wordCount) {
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

function generateStarRating(stars) {
    return '<span class="fa fa-star checked"></span>'.repeat(stars)
        + '<span class="fa fa-star unchecked"></span>'.repeat(5 - stars);
}

// Index

function addGameEntry(game) {
    /**
     * Add a game entry inside the `game-entries` container.
     * @param {game} - The game entry to add
     */
    const template = document.querySelector("template");
    const copy = template.content.cloneNode(true);
    
    const a = copy.querySelectorAll("a");
    const imgLink = a[0];
    imgLink.href = `reviews.html?title=${game.title}`;
    
    const h2Link = a[1];
    h2Link.href = `reviews.html?title=${game.title}`;
    h2Link.innerText = game.title; // Header link

    const img = copy.querySelector("img");
    img.src = `img/cover/${game.file}.png`;
    img.alt = game.title;

    const starRating = copy.querySelector("#star-rating");
    starRating.innerHTML = generateStarRating(game.rating);

    const developerDate = copy.querySelector("#developer-date");
    developerDate.innerText = `${game.developer}, ${game.release_date}`;

    const description = copy.querySelector("#description");
    description.innerText = truncateNoCutoff(game.description, 20);

    const source = a[2];
    source.innerText = game.source.name;
    source.href = game.source.link;

    document.querySelector("#game-entries").append(copy);
}

// View Reviews

function generateReviewAuthorData(user, review) {
    return `
        <a href="profile.html?user=${user.username}">
            <img class="avatar me-2" src="img/avatar/${user.avatar}">
        </a>
        <div class="author-date">
            <p class="fw-bold reviewer-name" >
                <a class="block-link" href="profile.html?user=${user.username}">
                    ${user.username}
                </a>
            </p>
            <p class="fst-italic review-date">${review.date}</p>
        </div>
    `;
}

function addReview(review) {
    /**
     * Add a review entry to the View Reviews page.
     */
    let user = users.find((user) => user.username == review.username);
    let template = `
        <div class="col-6 border rounded review">
            <div class="star-rating">
                ${generateStarRating(review.rating)}
                <div class="votes">
                    <span class="fa fa-thumbs-up"></span>
                    ${review.upvotes}
                    <span class="fa fa-thumbs-down"></span>
                </div>
            </div>
            <h3 class="fw-bold fs-4">
                <a class="block-link" href="review.html?user=${user.username}&game=${review.game}">
                ${review.title}
                </a>
            </h3>
            <div class="review-info-text">
                <p>
                    ${truncateNoCutoff(review.text, 3)}
                </p>
            </div>
            <div class="reviewer-info">
                    ${generateReviewAuthorData(user, review)}
            </div>
        </div>
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
    gameInfoContainer.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.25),var(--bs-dark)), url("/img/back/${game['file']}.png")`;
    gameTitle.innerText = game.title;
    gameDeveloperDate.innerText = `${game.developer}, ${game.release_date}`;
    gameDescriptionText.innerText = game['description'];

    let game_reviews = reviews.filter(review => review.game == title);
    game_reviews.forEach((review => {
        addReview(review);
    }));
}

// Users

function addUserEntry(user) {
    const tbody = document.querySelector("tbody");
    const template = document.querySelector("#user-row");
    const clone = template.content.cloneNode(true);

    const tr = clone.querySelector("tr");
    tr.onclick = () => sendToProfile(user.username);
    if (user.lastSeen == 'Online') {
        tr.classList.add("table-success")
    }

    const img = document.createElement("img");
    img.classList.add("avatar");
    img.src = `img/avatar/${user.avatar}`
    img.alt = `Avatar`;

    const td = clone.querySelectorAll("td");
    td[0].append(img);
    td[1].innerText = user.username;
    td[2].innerText = user.lastSeen;
    td[3].innerText = user.accountAge;

    tbody.append(clone);
}

function sendToProfile(username) {
    window.location = `profile.html?user=${username}`;
}

function showUserData(username) {
    user = users.find(user => user.username == username);
    document.getElementById("username").innerText = username;
    document.getElementById("subtitle").innerText = user.subtitle;
    document.getElementById("last-seen").innerText = user.lastSeen;
    document.getElementById("description").innerText = user.description || "No description provided.";
    document.getElementById("favorite-game").innerText = user.favoriteGame;
    document.getElementById("account-age").innerText = user.accountAge;
    document.getElementById("avatar").src = `img/avatar/${user.avatar}`;
    let user_reviews = reviews.filter(review => review.username == username);
    user_reviews.forEach(review => {
        addReview(review);
    })
}

// Reviews

function showReviewData(username, gameTitle) {
    let review = reviews.find(review => review.username == username && review.game == gameTitle);
    document.getElementById("star-rating").innerHTML = generateStarRating(review.rating);
    document.getElementById("title").innerHTML = review.title;
    document.getElementById("return-game").innerHTML = `<a href="reviews.html?title=${review.game}">View ${review.game}</a>`;
    document.getElementById("upvotes").innerHTML = review.upvotes;
    document.getElementById("text").innerText = review.text;
    document.getElementById("developer-response").innerText = review.developer_response || "No response.";
    document.getElementById("reviewer-info").innerHTML = generateReviewAuthorData(users.find(user => user.username == username), review);
}

// ---

let url = document.URL;
let queryString = window.location.search;
let params = new URLSearchParams(queryString);

if (url.endsWith('/') || url.includes("index.html")) { // is Index / Game List
    games.forEach(game => {
        addGameEntry(game);
    })
} else if (url.includes("reviews.html")) {
    showGameData(params.get("title"));
} else if (url.includes("review.html")) {
    showReviewData(params.get("user"), params.get("game"));
} else if (url.includes("users.html")) {
    users.forEach(user => {
        addUserEntry(user);
    });
} else if (url.includes("profile.html")) {
    showUserData(params.get("user"));
} else if (url.includes("self.html")) {
    showUserData(params.get("user"));
}

// Button Hiding in Profile
function hideEdit(elem) {
    for (let x = 0; x < elem.length; x++) {
        if (document.getElementById(elem[x]).style.display == 'none') {
            document.getElementById(elem[x]).style.display = 'block';
        } else {
            document.getElementById(elem[x]).style.display = 'none';
        }
    }
}
