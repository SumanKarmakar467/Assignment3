let cartBody = document.getElementById("cart-body");
let totalPriceEl = document.getElementById("total-price");
let emptyRow = document.getElementById("empty-row");

let count = 0;
let totalPrice = 0;

// Select all Add buttons
document.querySelectorAll(".Add-items").forEach(button => {
    button.addEventListener("click", () => {
        const itemDiv = button.parentElement;
        const text = itemDiv.querySelector("div").innerText;
        const priceText = itemDiv.querySelector(".price").innerText;

        const serviceName = text.split("-")[0].trim();
        const price = parseFloat(priceText.replace("$", "").replace("₹", ""));

        addItem(serviceName, price);
    });
});

function addItem(name, price) {
    count++;
    totalPrice += price;

    // Remove empty row once first item is added
    if (emptyRow) {
        emptyRow.remove();
        emptyRow = null;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${count}</td>
        <td>${name}</td>
        <td>₹${price.toFixed(2)}</td>
    `;

    cartBody.appendChild(row);
    totalPriceEl.innerText = totalPrice.toFixed(2);
}

// Booking form submit
document.getElementById("booking-form").addEventListener("submit", function (e) {
    e.preventDefault();

    if (count === 0) {
        alert("Please add at least one service before booking.");
        return;
    }

    const name = document.getElementById("customer-name").value;
    const email = document.getElementById("customer-email").value;
    const phone = document.getElementById("customer-phone").value;

    alert(
        `Booking Successful!\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nTotal: ₹${totalPrice.toFixed(2)}`
    );

    this.reset();
});
