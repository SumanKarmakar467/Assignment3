const cartBody = document.getElementById("cart-body");
const totalPriceEl = document.getElementById("total-price");
const bookingForm = document.getElementById("booking-form");
const servicesSection = document.getElementById("services");
const heroBookBtn = document.querySelector(".book-button .book-service");

let totalPrice = 0;
const addedItems = new Map();

if (heroBookBtn && servicesSection) {
    heroBookBtn.addEventListener("click", () => {
        servicesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

document.querySelectorAll(".Add-items").forEach((button, index) => {
    const itemDiv = button.parentElement;
    const text = itemDiv.querySelector("div").innerText;
    const priceText = itemDiv.querySelector(".price").innerText;
    const serviceName = text.split("-")[0].trim();
    const price = parseFloat(priceText.replace("$", "").replace("?", "").replace("₹", ""));
    const serviceId = `service-${index + 1}`;

    button.dataset.serviceId = serviceId;
    button.dataset.serviceName = serviceName;
    button.dataset.servicePrice = price.toString();
    setButtonState(button, false);

    button.addEventListener("click", () => toggleItem(button));
});

function toggleItem(button) {
    const serviceId = button.dataset.serviceId;
    const serviceName = button.dataset.serviceName;
    const price = parseFloat(button.dataset.servicePrice);

    if (addedItems.has(serviceId)) {
        removeItem(serviceId, price);
        setButtonState(button, false);
        return;
    }

    addItem(serviceId, serviceName, price);
    setButtonState(button, true);
}

function addItem(serviceId, name, price) {
    removeEmptyRow();

    const row = document.createElement("tr");
    row.dataset.serviceId = serviceId;
    row.innerHTML = `
        <td></td>
        <td>${name}</td>
        <td>?${price.toFixed(2)}</td>
    `;

    cartBody.appendChild(row);
    addedItems.set(serviceId, row);
    totalPrice += price;
    refreshCart();
}

function removeItem(serviceId, price) {
    const row = addedItems.get(serviceId);
    if (row) {
        row.remove();
        addedItems.delete(serviceId);
    }

    totalPrice = Math.max(0, totalPrice - price);
    refreshCart();
}

function refreshCart() {
    const rows = cartBody.querySelectorAll("tr[data-service-id]");
    rows.forEach((row, index) => {
        row.children[0].innerText = index + 1;
    });

    totalPriceEl.innerText = totalPrice.toFixed(2);

    if (rows.length === 0) {
        renderEmptyRow();
    }
}

function setButtonState(button, isAdded) {
    button.classList.toggle("remove-state", isAdded);
    button.innerHTML = isAdded
        ? 'Remove <ion-icon name="remove-circle-outline"></ion-icon>'
        : 'Add <ion-icon name="add-circle-outline"></ion-icon>';
}

function removeEmptyRow() {
    const emptyRow = document.getElementById("empty-row");
    if (emptyRow) {
        emptyRow.remove();
    }
}

function renderEmptyRow() {
    if (document.getElementById("empty-row")) {
        return;
    }

    const row = document.createElement("tr");
    row.className = "empty-row";
    row.id = "empty-row";
    row.innerHTML = `
      <td colspan="3">
        <div class="empty-state">
          <ion-icon name="information-circle-outline"></ion-icon>
          <p><strong>No Items Added</strong></p>
          <p>Add items to the cart from the service bar</p>
        </div>
      </td>
    `;
    cartBody.appendChild(row);
}

bookingForm.addEventListener("submit", function (e) {
    e.preventDefault();

    if (addedItems.size === 0) {
        alert("Please add at least one service before booking.");
        return;
    }

    const name = document.getElementById("customer-name").value;
    const email = document.getElementById("customer-email").value;
    const phone = document.getElementById("customer-phone").value;

    alert(
        `Booking Successful!\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nTotal: ?${totalPrice.toFixed(2)}`
    );

    this.reset();
});
