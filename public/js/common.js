function toggleEdit() {
    document.querySelectorAll(".allow-editing").forEach(element => {
        element.toggleAttribute("contenteditable");
        element.style.textDecoration = element.style.textDecoration ? "" : "underline";
    }
    );
    let editButton = document.querySelector("#edit-button");
    editButton.textContent = (editButton.textContent == "Save changes") ? "Edit" : "Save changes";
}