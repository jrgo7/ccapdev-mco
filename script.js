function truncateNoCutoff(text, length) {
    let truncatedText = text.substring(0, 160);
    return truncatedText.substring(
        0,
        Math.min(truncatedText.length, truncatedText.lastIndexOf(' '))
    );
}



const games = [
    {
        title: "Super Mario Bros.",
        rating: 5,
        developer: "Nintendo",
        release_date: "1989",
        description: "Plumber brothers Mario and Luigi from Brooklyn have just arrived in an outlandish realm called the Mushroom Kingdom. It was ruled by Princess Toadstool and her faithful Mushroom people. But one day, evil cast a shadow over the land and the evil King Bowser Koopa emerged with his army of Goombas, Spinies, Flying Koopas, and other malignant creatures... (truncated)",
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
        }
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
    }
]