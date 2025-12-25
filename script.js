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

const boxes = document.querySelectorAll(".box");

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        const color = box.textContent.toLowerCase();
        
        if (box.style.backgroundColor === color) {
            box.style.backgroundColor = "transparent";
        } else {
            box.style.backgroundColor = color;
        }
    });
});
