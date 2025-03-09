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
document.querySelectorAll(".img-upld-btn").forEach(button => {
    button.addEventListener("click", function () {
        currentImageType = this.getAttribute("data-image-type");
    });
});

const imageTypes = ["boxart", "wallpaper", "profile"];

imageTypes.forEach(imageType => {
    const inputElement = document.getElementById(imageType + "-input");

    if (inputElement) { // Ensure the input exists before adding event listener
        inputElement.addEventListener("change", function (event) {
            const file = event.target.files[0];

            if (file && currentImageType) {
                tempImages[currentImageType] = file;


                const reader = new FileReader();
                reader.onload = function (e) {
                    document.getElementById(currentImageType + "-preview").innerHTML = `<img src="${e.target.result}" class="img-fluid " alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

// Search, sort, filter functions

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

function filterReviews() {
    let searchText = document.querySelector("#search-text").value;
    let key = searchText.toLowerCase();
    let reviewEntries = document.querySelectorAll(".review");
    reviewEntries.forEach(entry => {
        let title = entry.querySelector(".review-title").textContent.toLowerCase();
        let text = entry.dataset.text.toLowerCase();
        if (title.includes(key)) {
            entry.toggleAttribute("hidden", false)
            entry.title = ""
        } else if (text.includes(key)) {
            entry.toggleAttribute("hidden", false)
            entry.title = "Search query found in body"
        } else {
            entry.toggleAttribute("hidden", true)
            entry.title = ""
        }
    })
}

// Attempt to sort and filter as soon as the page finishes loading
sortGames();
filterGames();
filterReviews();