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
    const title = document.getElementById("game-title").innerText;
    const developer = document.getElementById("game-developer").innerText;
    const releaseDate = document.getElementById("game-release-date").innerText;
    const description = document.getElementById("game-description-text").innerText;
    const source = document.getElementById("game-source").innerText;

    const response = await fetch("/save-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, developer, releaseDate, description, source }),
    });

    toggleEdit(); 
    let editButton = document.querySelector("#edit-button");
    editButton.textContent = "Edit";
    editButton.onclick = editContent;
}

async function saveProfile() {
    const username = document.getElementById("username").innerText;
    const subtitle = document.getElementById("subtitle").innerText;
    const description = document.getElementById("description").innerText;
    const favorite = document.getElementById("favorite-game").innerText;

    const response = await fetch("/save-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, subtitle, description, favorite }),
    });

    toggleEdit();
    let editButton = document.querySelector("#edit-button");
    editButton.textContent = "Edit";
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

document.getElementById("submit-image").addEventListener("click", function() {
    document.getElementById("upload-image-form").submit();
});

document.getElementById('image-input').addEventListener('change', function(event) {
    const file = event.target.files[0];
    const previewDiv = document.getElementById('image-preview');
    
    previewDiv.innerHTML = '';

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgElement = document.createElement('img');
            imgElement.src = e.target.result;
            imgElement.style.maxWidth = '100%';
            imgElement.style.height = 'auto';
            imgElement.style.borderRadius = '5px';
            imgElement.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';
            previewDiv.appendChild(imgElement);
        }
        reader.readAsDataURL(file);
    }
});