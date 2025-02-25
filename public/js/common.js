function toggleEdit() {
    document.querySelectorAll(".allow-editing").forEach(element => {
        element.toggleAttribute("contenteditable");
        element.style.textDecoration = element.style.textDecoration ? "" : "underline";
    }
    );
    for (i = 1; i <= 5; i++) {
        let star = document.querySelector(`#star-${i}`);
        if (star.classList.contains("unclickable")) {
            star.classList.remove("unclickable");
            star.style.textDecoration = 'underline';
        } else if (!star.classList.contains("allow-editing-always")) { // allow-editing-always is for leaving a review
            star.classList.add("unclickable");
            star.style.textDecoration = 'none';
        }
    }

    let editButton = document.querySelector("#edit-button");
    editButton.textContent = (editButton.textContent == "Save changes") ? "Edit" : "Save changes";
}

function setStarRating(rating) {
    for (i = 1; i <= 5; i++) {
        let star = document.getElementById(`star-${i}`);
        if (i <= rating) {
            star.style.color = "var(--gold)";
        } else {
            star.style.color = "var(--white)";
        }
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

