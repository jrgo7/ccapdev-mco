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
    } else if (window.location.pathname.includes("/profile")){
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
document.getElementById("submit-review").addEventListener("click", function() {
    document.getElementById("leave-review-form").submit();
});

document.querySelectorAll(".img-upld-btn").forEach(button => {
    button.addEventListener("click", function() {
        currentImageType = this.getAttribute("data-image-type");
    });
});

const imageTypes = ["boxart", "wallpaper", "profile"];

imageTypes.forEach(imageType => {
    const inputElement = document.getElementById(imageType + "-input");

    if (inputElement) { // Ensure the input exists before adding event listener
        inputElement.addEventListener("change", function(event) {
            const file = event.target.files[0];

            if (file && currentImageType) {
                tempImages[currentImageType] = file; 

                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById(currentImageType + "-preview").innerHTML = `<img src="${e.target.result}" class="img-fluid " alt="Preview">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});

