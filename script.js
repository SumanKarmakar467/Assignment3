// ==============================
// GREET USER WITH NAME
// ==============================

const greetBtn = document.querySelector("button");
const nameInput = document.getElementById("name");
const helloText = document.querySelector(".hello");

greetBtn.addEventListener("click", () => {
    const userName = nameInput.value.trim();

    if (userName === "") {
        alert("Please enter your name");
        return;
    }

    helloText.textContent = `Hello, ${userName}`;
});


// ==============================
// MULTI-COLOR BOX TOGGLE LOGIC
// ==============================

const boxes = document.querySelectorAll(".box");

boxes.forEach((box) => {
    box.addEventListener("click", () => {

        // Get color from box text
        const color = box.textContent.toLowerCase();

        // Toggle background color
        if (box.style.backgroundColor === color) {
            box.style.backgroundColor = "transparent";
        } else {
            box.style.backgroundColor = color;
        }
    });
});
