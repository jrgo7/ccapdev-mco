exports.users = [
    {
        email: "416@hk.com",
        password: "1234",
        username: "416",
        subtitle: "Shikikan <3",
        avatar: "416.png",
        description: "HK416, originally my name was HKM4 when first unveiled, then it was taken away... Why? (Heh) I'll leave that to your imagination. After that, I gained a new name and underwent severe modifications, which caused a lot of controversy during that time. Commander, I will make you forget about all of those people-- Only me, all you need is me.",
        lastSeen: new Date(Date.now() - 2 * 30 * 24 * 60 * 60 * 1000), // 2 months ago
        accountCreateDate: new Date(Date.now() - 1 * 365 * 24 * 60 * 60 * 1000), // 1 year ago
        favoriteGame: "Girls' Frontline"
    },
    {
        email: "main@frog.com",
        password: "mf24",
        username: "mainFrog",
        subtitle: "FrogCritic site owner and admin",
        avatar: "mainFrog.png",
        description: "greninja",
        lastSeen: new Date(Date.now() - (1 * 365 + 2 * 30) * 24 * 60 * 60 * 1000), // 1 year, 2 months ago
        accountCreateDate: new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000), // 3 years ago
        favoriteGame: "Girls' Frontline"
    },
    {
        email: "lowest@low.com",
        password: "low15",
        username: "lowy",
        subtitle: "Gacha addict",
        avatar: "lowy.png",
        description: "Gacha addict・Draws sometimes・Inaantok pero ayaw matulog・飛ぶにゃん♪・学マス/Blue Archive(Asia)/プリコネ/ヘブバン/FGO(NA)",
        lastSeen: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        accountCreateDate: new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), // 2 years ago
        favoriteGame: "Gakuen Idolmaster"
    },
    {
        email: "wafl@rain.com",
        password: "rain12",
        username: "wafl",
        subtitle: "Faito da-yousoro!",
        avatar: "wafl.png",
        description: "Together, we can show the world what we can do!",
        lastSeen: new Date(), // Online (current date/time)
        accountCreateDate: new Date(Date.now() - 1 * 365 * 24 * 60 * 60 * 1000), // 1 year ago
        favoriteGame: "Super Mario World"
    },
    {
        email: "roymer@roemer.com",
        password: "password",
        username: "Roymer",
        subtitle: ":mew:",
        avatar: "roymer.png",
        description: "I'm Roemer I check my inbox pretty frequently, so feel free to send something! Good morning. Order for Roemer? No, not Robert, swap the B with an M. Also, there is no T. No it's not Romer, it's like Ro-E-mer. No, it's not Roymer. There is an E. Yeah it's before the M. No, replace the Y with an E. No, that's still not it... Yeah.... Here, let me just show you my ID...",
        lastSeen: new Date(Date.now() - (4 * 365 + 5 * 30) * 24 * 60 * 60 * 1000), // 4 years, 5 months ago
        accountCreateDate: new Date(Date.now() - 6 * 365 * 24 * 60 * 60 * 1000), // 6 years ago
        favoriteGame: "Robotek"
    },
    {
        email: "pow@cc.com",
        password: "123pow",
        username: "pow",
        subtitle: "•_•",
        avatar: "pow.png",
        description: "",
        lastSeen: new Date(), // Online (current date/time)
        accountCreateDate: new Date(Date.now() - 10 * 365 * 24 * 60 * 60 * 1000), // 10 years ago
        favoriteGame: "FL Studio"
    },
    {
        email: "cgk@ghj.com",
        password: "faunbest",
        username: "cgkghj",
        subtitle: "average elation enjoyer",
        avatar: "cgkghj.png",
        description: "Yes, I picked this username on purpose",
        lastSeen: new Date(), // Online (current date/time)
        accountCreateDate: new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000), // 3 months ago
        favoriteGame: "Minecraft"
    },
    {
        email: "mario@mail.com",
        password: "mario",
        username: "mario_dev",
        subtitle: "Makers of hit game super mario bros",
        avatar: "",
        description: "Hi! We respond to reviews normally :>",
        lastSeen: new Date(), 
        accountCreateDate: new Date(),
        favoriteGame: "Super Mario Bros."
    }
];

exports.games = [
    {
        dev_email: "416@hk.com",
        title: "Super Mario Bros.",
        developer: "Nintendo",
        release_date: new Date("1985"),
        description: "Plumber brothers Mario and Luigi from Brooklyn have just arrived in an outlandish realm called the Mushroom Kingdom. It was ruled by Princess Toadstool and her faithful Mushroom people. But one day, evil cast a shadow over the land and the evil King Bowser Koopa emerged with his army of Goombas, Spinies, Flying Koopas, and other malignant creatures. King Koopa abducted Princess Toadstool and trapped her faithful Mushroom People in seven of his castles. So Mario and Luigi must intrepid deep and hazardous waters, jump from tree to tree (don’t look down!), and visually examine their steps in the dark evil castles filled with fire balls and lava pits and must utilize their magic powers to subjugate the evil King Koopa and rescue the Princess.",
        file: "Super Mario Bros. (World)",
        source: {
            name: "IMDb",
            link: "https://www.imdb.com/title/tt0177266/"
        }
    },
    {
        dev_email: "pacman@mail.com",
        title: "Pac-Man",
        developer: "Namco",
        release_date: new Date("1993"),
        description: "Players guide a yellow, pie-shaped creature around a single maze, munching dots while avoiding four roaming ghosts. Four energizer dots are on the board, one in each corner. Eating one of these special dots will temporarily empower Pac-Man to turn the tables on the ghosts. Each time all the dots in a maze are eaten, play resumes with a fresh screen.",
        file: "Pac-Man (USA) (Namco)",
        source: {
            name: "IMDb",
            link: "https://www.imdb.com/title/tt0260264/"
        },
    },
    {
        dev_email: "pkmn@mail.com",
        title: "Pokémon: Red Version",
        developer: "GameFreak",
        release_date: new Date("1998"),
        description: "Ash is a young trainer traveling around the Pokemon world with his partner Pikachu. He is joined by his friends to help aid him in his journey. His ultimate goal is to become a Pokemon Master, which he will not stop training and working hard to achieve.",
        file: "Pokemon - Red Version (USA, Europe) (SGB Enhanced)",
        source: {
            name: "IMDb",
            link: "https://www.imdb.com/title/tt0217733/"
        }
    },
    {
        dev_email: "ebound@mail.com",
        title: "EarthBound",
        developer: "ConcernedApe",
        release_date: new Date("1994"),
        description: "One night a large meteor crashes to the earth. A young boy named Ness goes out to investigate, and discovers that he and three other kids are destined to save the earth from an alien leader called Giygas, who is going to destroy the world.",
        file: "EarthBound (USA)",
        source: {
            name: "IMDb",
            link: "https://www.imdb.com/title/tt0208332/"
        }
    },
    {
        dev_email: "femblem@mail.com",
        title: "Fire Emblem: Seisen no Keifu",
        developer: "Intelligent Systems",
        release_date: new Date("1996"),
        description: "On the continent of Judgral, eight kingdoms launch a war against the other in a power-struggle to control the continent. When Sigurd, the prince of the Duchy of Calphy, and his army becomes involved in the war, their actions will forever change the continent in a game that takes place across two generations as Sigurd's son, Seliph, must set things right when his father meets a violent end and Judgral is left in ruins in what many regard as the Fire Emblem series' darkest installment.",
        file: "Fire Emblem - Seisen no Keifu (Japan)",
        source: {
            name: "IMDb",
            link: "https://www.imdb.com/title/tt7468122/"
        }
    }
]

exports.reviews = [
    {
        game: "Super Mario Bros.",
        title: "Good game",
        email: "wafl@rain.com",
        post_date: "2025-03-14T12:00:00Z",
        edit_date: "2025-03-14T12:00:00Z",
        rating: 5,
        upvotes: 0,
        text: "My favorite game",
    },
    {
        game: "Super Mario Bros.",
        title: "Lots of fun",
        email: "lowest@low.com",
        post_date: "2025-03-14T12:00:00Z",
        edit_date: "2025-03-14T12:00:00Z",
        rating: 4,
        upvotes: 0,
        text: "Finished in 2 hours",
    },
    {
        game: "Super Mario Bros.",
        title: "Its okay",
        email: "main@frog.com",
        post_date: "2025-03-14T12:00:00Z",
        edit_date: "2025-03-14T12:00:00Z",
        rating: 3,
        upvotes: 0,
        text: "I like it",
    },
    {
        game: "Super Mario Bros.",
        title: "Could be better",
        email: "roymer@roemer.com",
        post_date: "2025-03-14T12:00:00Z",
        edit_date: "2025-03-14T12:00:00Z",
        rating: 2,
        upvotes: 0,
        text: "One directional",
    },
    {
        game: "Super Mario Bros.",
        title: "I hate it",
        email: "cgk@ghj.com",
        post_date: "2025-03-14T12:00:00Z",
        edit_date: "2025-03-14T12:00:00Z",
        rating: 1,
        upvotes: 0,
        text: "Its so old",
    }
]