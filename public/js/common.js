// * Client-side JavaScript

let tempImages = {};
let currentImageType = null;

function toggleEdit() {
    document.querySelectorAll(".allow-editing").forEach(element => {
        if (element.hasAttribute("contenteditable")) {
            element.removeAttribute("contenteditable");
            element.style.textDecoration = "none";
        } else {
            element.setAttribute("contenteditable", "true");
            element.style.textDecoration = "underline";
        }
    });

    for (let i = 1; i <= 5; i++) {
        let star = document.querySelector(`#star-${i}`);
        if (star.classList.contains("unclickable")) {
            star.classList.remove("unclickable");
            star.style.textDecoration = "underline";
        } else if (!star.classList.contains("allow-editing-always")) {
            star.classList.add("unclickable");
            star.style.textDecoration = "none";
        }
    }

    let editButton = document.querySelector("#edit-button");
    editButton.textContent = (editButton.textContent === "Save changes") ? "Edit" : "Save changes";


    document.querySelectorAll(".img-upld-btn").forEach(button => {
        button.style.display = button.style.display === "none" ? "inline-block" : "none";
    });
}

function editContent() {
    toggleEdit();

    if (window.location.pathname.includes("/reviews")) {
        document.querySelector("#edit-button").onclick = saveGame;
    } else if (window.location.pathname.includes("/profile")) {
        document.querySelector("#edit-button").onclick = saveProfile;
    }
}

async function saveGame() {
    let formData = new FormData();

    formData.append("title", document.getElementById("game-title").innerText);
    formData.append("developer", document.getElementById("game-developer").innerText);
    formData.append("releaseDate", document.getElementById("game-release-date").innerText);
    formData.append("description", document.getElementById("game-description-text").innerText);
    formData.append("source", document.getElementById("game-source").innerText);

    if (tempImages.boxart) {
        formData.append("boxart", tempImages.boxart);
    }
    if (tempImages.wallpaper) {
        formData.append("wallpaper", tempImages.wallpaper);
    }

    const response = await fetch("/save-game", {
        method: "POST",
        body: formData,
    }).then(res => res.json()).then(data => {
        if (data.refresh) {
            window.location.reload();
        }
    });

    tempImages = {};
    toggleEdit();
    //Can be placed in ToggleEdit
    let editButton = document.querySelector("#edit-button");
    editButton.onclick = editContent;
}

async function upvote(reviewId) {
    let formData = new FormData();

    formData.append("reviewId", reviewId);

    const response = await fetch("/upvote", {
        method: "POST",
        body: formData,
    }).then(res => res.json()).then(data => {
        if (data.refresh) { window.location.reload(); }
    });
}

async function downvote(reviewId) {
    let formData = new FormData();

    formData.append("reviewId", reviewId);

    const response = await fetch("/downvote", {
        method: "POST",
        body: formData,
    }).then(res => res.json()).then(data => {
        if (data.refresh) { window.location.reload(); }
    });
}


async function saveProfile() {
    let formData = new FormData();

    formData.append("username", document.getElementById("username").innerText);
    formData.append("subtitle", document.getElementById("subtitle").innerText);
    formData.append("description", document.getElementById("description").innerText);
    formData.append("favorite", document.getElementById("favorite-game").innerText);

    if (tempImages.profile) {
        formData.append("profile", tempImages.profile);
    }

    const response = await fetch("/save-profile", {
        method: "POST",
        body: formData,
    })
        .then(res => res.json()).then(data => {
            if (data.refresh) {
                window.location.reload();
            }
        });

    tempImages = {};
    toggleEdit();
    //Can be placed in ToggleEdit
    let editButton = document.querySelector("#edit-button");
    editButton.onclick = editContent;
}


function setStarRating(rating) {
    document.getElementById("leave-review-star-rating").value = rating;
    for (i = 1; i <= rating; i++) {
        let star = document.getElementById(`star-${i}`);
        star.style.color = "var(--gold)";
    }
    for (i = rating + 1; i <= 5; i++) {
        let star = document.getElementById(`star-${i}`);
        star.style.color = "var(--white)";
    }
}

function uploadFile() {
    let input = document.createElement("input");
    input.type = "file";
    input.click();
}

//Add listeners to buttons
document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "change-password-form") {
        const pass = document.getElementById("pass").value;
        const passConfirm = document.getElementById("pass-confirm").value;

        if (pass !== passConfirm) {
            e.preventDefault();
            document.getElementById("password-change-error").classList.remove("d-none");
        } else {
            document.getElementById("password-change-error").classList.add("d-none");
        }
    }
})

document.querySelectorAll(".img-upld-btn").forEach(button => {
    button.addEventListener("click", function () {
        currentImageType = this.getAttribute("data-image-type");
    });
});

/* Upload Image Partial */

const imageTypes = ["boxart", "wallpaper", "profile"];

imageTypes.forEach(imageType => {
    const inputElement = document.getElementById(imageType + "-input");

    document.addEventListener("DOMContentLoaded", function () {
        if (inputElement) {
            inputElement.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    e.preventDefault();
                }
            });
        }
    });
      
    if (inputElement) {
        inputElement.addEventListener("change", function (event) {
            const imgUrl = inputElement.value;

            if (imgUrl && currentImageType) {
                tempImages[currentImageType] = imgUrl;

                document.getElementById(currentImageType + "-preview").innerHTML = `<img src="${imgUrl}" class="img-fluid " alt="Preview">`;
            }
        });
    }
});

// End of Upload image

const registerProfile = document.getElementById("register-profile-input");
if (registerProfile) { // Ensure element exists before adding event listener
    registerProfile.addEventListener("change", function (event) {
        const imgURL = registerProfile.value;
        const preview = document.getElementById('register-profile-preview');

        if (imgURL) {
                preview.src = imgURL; // Set the preview image
        } else {
            preview.src = 'img/avatar/guest.png'; // Reset to default if no file is chosen
        }
    })
}

// Search, sort, filter functions

/**
 * @param {String} text 
 * @param {Number} wordCount
 * @returns A trimmed version of `text` having only the specified `wordCount`, with "..." appended if the original length exceeds it
 */
function truncateWords(text, wordCount) {
    let splitText = text.split(" ").splice(0, wordCount).join(" ");
    splitText.trimEnd(",");
    let lastCharacter;
    let lastCharacterIsPunctuation;
    do {
        lastCharacter = splitText.slice(-1);
        lastCharacterIsPunctuation = lastCharacter === ',';
        if (lastCharacterIsPunctuation) {
            splitText = splitText.substring(0, splitText.length - 1);
        }
    } while (lastCharacterIsPunctuation);
    if (splitText != text) {
        splitText += "...";
    }
    return splitText;
}

function generateStarRating(rating) {
    let out = "";
    for (let i = 1; i <= 5; i++) {
        let checked = "unchecked";
        if (i <= rating) {
            checked = "checked";
        }
        out += `<span class="fa fa-star fa-xl ${checked}"></span>`;
    }
    return out;
}

function resetPage() {
    document.querySelector('#page-number').value = 1;
}

function formatDate(post_date, edit_date) {
    if (post_date == edit_date) {
        return new Date(post_date).toDateString();
    } else {
        return new Date(post_date).toDateString() + " (edited " + new Date(edit_date).toDateString() + ")";
    }
}

async function listReviews() {
    let gameTitle = document.querySelector('#game-title')
    if (gameTitle) { gameTitle = gameTitle.textContent; }
    let username = document.querySelector('#username');
    if (username) { username = username.textContent; }

    let searchQuery = document.querySelector('#search-text')?.value;
    let page = document.querySelector('#page-number').value;
    const reviewsPerPage = 4;

    let reviewContainer = document.querySelector("#reviews-container");
    reviewContainer.innerHTML = 'Loading...';

    let paginationNav = document.querySelector('#pagination-nav');
    paginationNav.innerHTML = "";

    await fetch('/get-reviews?' + new URLSearchParams({
        gameTitle, username, searchQuery, page
    })).then(res => res.json()).then(reviews => {
        reviewContainer.innerHTML = '';
        paginationNav.innerHTML = "";
        let reviewTemplate = document.querySelector("template#review");
        let reviewCount = 0;
        let pageCount = 1;
        reviews.forEach(review => {
            console.log(review);
            let reviewHtml = reviewTemplate.content.cloneNode(true);
            let reviewStarRating = reviewHtml.querySelector('#review-star-rating');
            let reviewVotes = reviewHtml.querySelector('#review-votes');
            let reviewLink = reviewHtml.querySelector('#review-link');
            let reviewText = reviewHtml.querySelector("#review-text");
            let reviewAuthorUsername = reviewHtml.querySelector("#review-author-username");
            let reviewGameTitle = reviewHtml.querySelector("#review-game-title");
            let reviewDate = reviewHtml.querySelector("#review-date");

            reviewStarRating.innerHTML = generateStarRating(review.rating);
            
            reviewVotes.textContent = `${review.votes} vote(s)`;
            
            reviewLink.href = `/review?id=${review._id}`;
            reviewLink.textContent = review.title;
            
            reviewText.textContent = truncateWords(review.text, 7);
            
            reviewContainer.append(reviewHtml);

            reviewAuthorUsername.textContent = review.user.username;
            reviewAuthorUsername.href = `profile?user=${review.user._id}`;

            reviewGameTitle.textContent = review.game;
            reviewGameTitle.href = `reviews?game=${review.game}`
            
            reviewDate.textContent = formatDate(review.post_date, review.edit_date);

            reviewCount++;
            if (reviewCount % reviewsPerPage === 0) {
                pageCount++;
            }
        })

        for (let i = 1; i <= Math.max(pageCount, page); i++) {
            let pageButtonListItem = document.createElement('li');
            pageButtonListItem.classList.add("page-item");
            let pageButton = document.createElement('a');
            pageButton.textContent = i;
            pageButton.classList.add("page-link");
            if (i == page) {
                pageButton.classList.add("disabled");
                pageButton.classList.add("fw-bold");
            } else {
                pageButton.onclick = () => {
                    document.querySelector('#page-number').value = i
                    listReviews();
                };
            }
            pageButtonListItem.append(pageButton);
            paginationNav.append(pageButtonListItem);
        }
    });
}

function filterGames() {
    let searchText = document.querySelector("#search-text").value;
    let filterRatingAtLeast = Number(document.querySelector("#filter-select").value);
    let gameEntries = document.querySelectorAll(".index-game-entry");

    let key = searchText.toLowerCase();
    gameEntries.forEach(entry => {
        let title = entry.dataset.title.toLowerCase();
        let rating = Number(entry.dataset.rating);
        if (title.includes(key) && rating >= filterRatingAtLeast) {
            entry.toggleAttribute("hidden", false)
        } else {
            entry.toggleAttribute("hidden", true)
        }
    })
}

document.addEventListener('DOMContentLoaded', async () => {
    listReviews();
    let href = window.location.href;
    if (href.includes('/reviews')) {
        // Check if user has an existing review.
        let gameTitle = document.querySelector('#game-title').textContent;
        await fetch('/get-review-of-game-by-user?' + new URLSearchParams({
            gameTitle
        })).then(res => res.json()).then(review => {
            console.log(review);
            if (review) {
                let leaveReviewButton = document.querySelector('#leave-review-button');
                leaveReviewButton.textContent = "Edit existing review";
                leaveReviewButton.dataset.bsToggle = '';
                leaveReviewButton.dataset.bsTarget = '';
                leaveReviewButton.onclick = () => window.location.href = `/review?id=${review._id}`;
            }
        })
    }
})

function showInput(type) {
    let imageInput = document.getElementById("image-input");
    let videoInput = document.getElementById("video-input");
    let attachmentType = document.getElementById("attachment-type");

    if (type === "image") {
        imageInput.classList.remove("hidden");
        videoInput.classList.add("hidden"); 
        attachmentType.value = "image";

    } else if (type === "video") {
        videoInput.classList.remove("hidden");
        imageInput.classList.add("hidden"); 
        attachmentType.value = "video";
    }
}

function sortGames() {
    const SortImplementations = Object.freeze([
        {
            key: "none",
            comparator: (a, b) => 0
        },
        {
            key: "rating",
            comparator: (a, b) => Number(b.key) - Number(a.key)
        },
        {
            key: "title",
            comparator: (a, b) => String(b.key).localeCompare(String(a.key))
        },
        {
            key: "developer",
            comparator: (a, b) => String(b.key).localeCompare(String(a.key))
        },
        {
            key: "releaseDate",
            comparator: (a, b) => Number(b.key) - Number(a.key)
        },
        {
            key: "reviewCount",
            comparator: (a, b) => Number(b.key) - Number(a.key)
        }
    ])
    let sortType = Number(document.querySelector("#order-type-select").value);
    let sortOrder = Number(document.querySelector("#order-arrangement-select").value);

    let gameEntries = document.querySelectorAll(".index-game-entry");
    let key = SortImplementations[sortType].key;
    console.log(`Sorting by ${key}`)

    let sortArr = []; // [{node, key}]
    gameEntries.forEach(
        entry => {
            sortArr.push({
                node: entry,
                key: entry.dataset[key]
            })
        }
    )

    console.log("Before sorting:")
    console.log(sortArr);
    sortArr.sort((a, b) => SortImplementations[sortType].comparator(a, b));
    if (sortOrder == 1) {
        sortArr.reverse();
    }
    console.log("After sorting:")
    console.log(sortArr);

    sortArr.forEach((entry, i) => {
        entry.node.style.order = i;
    })
}

// Attempt to sort and filter as soon as the page finishes loading
document.addEventListener("DOMContentLoaded", () => {
    sortGames();
    filterGames();
    filterReviews();
    console.log("HELLO")
});