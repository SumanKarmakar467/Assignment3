const cartBody = document.getElementById("cart-body");
const totalPriceEl = document.getElementById("total-price");
const bookingForm = document.getElementById("booking-form");
const servicesSection = document.getElementById("services");
const heroBookBtn = document.querySelector(".book-button .book-service");
const bookingEmailEl = document.querySelector(".mail-des1");
const ADMIN_EMAIL = bookingEmailEl?.innerText?.trim() || "imsumankarmakar@gmail.com";
const bookingSubmitBtn = bookingForm?.querySelector('button[type="submit"]');
const EMAILJS_CONFIG = window.EMAILJS_CONFIG || {
    publicKey: "",
    serviceId: "",
    templateId: ""
};

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
        removeCompletely(serviceId);
        return;
    }

    addNewItem(serviceId, serviceName, price, button);
}

function addNewItem(serviceId, name, unitPrice, button) {
    removeEmptyRow();

    const row = document.createElement("tr");
    row.dataset.serviceId = serviceId;
    row.innerHTML = `
        <td></td>
        <td>
            <div class="service-line">
                <span class="service-name">${name}</span>
                <div class="qty-controls">
                    <button type="button" class="qty-btn qty-minus" aria-label="Decrease quantity">-</button>
                    <span class="qty-value">1</span>
                    <button type="button" class="qty-btn qty-plus" aria-label="Increase quantity">+</button>
                </div>
            </div>
        </td>
        <td>₹<span class="line-total">${unitPrice.toFixed(2)}</span></td>
    `;

    cartBody.appendChild(row);

    const item = {
        row,
        button,
        unitPrice,
        quantity: 1
    };

    addedItems.set(serviceId, item);
    bindQuantityControls(serviceId, item);
    setButtonState(button, true, 1);
    refreshCart();
}

function bindQuantityControls(serviceId, item) {
    const plusBtn = item.row.querySelector(".qty-plus");
    const minusBtn = item.row.querySelector(".qty-minus");

    plusBtn.addEventListener("click", () => changeQuantity(serviceId, 1));
    minusBtn.addEventListener("click", () => changeQuantity(serviceId, -1));
}

function changeQuantity(serviceId, delta) {
    const item = addedItems.get(serviceId);
    if (!item) {
        return;
    }

    item.quantity += delta;

    if (item.quantity <= 0) {
        removeCompletely(serviceId);
        return;
    }

    updateItemRow(item);
    refreshCart();
}

function updateItemRow(item) {
    item.row.querySelector(".qty-value").innerText = item.quantity;
    item.row.querySelector(".line-total").innerText = (item.unitPrice * item.quantity).toFixed(2);
    setButtonState(item.button, true, item.quantity);
}

function removeCompletely(serviceId) {
    const item = addedItems.get(serviceId);
    if (!item) {
        return;
    }

    item.row.remove();
    addedItems.delete(serviceId);
    setButtonState(item.button, false);
    refreshCart();
}

function refreshCart() {
    const rows = cartBody.querySelectorAll("tr[data-service-id]");
    let updatedTotal = 0;

    rows.forEach((row, index) => {
        row.children[0].innerText = index + 1;

        const item = addedItems.get(row.dataset.serviceId);
        if (item) {
            updatedTotal += item.unitPrice * item.quantity;
        }
    });

    totalPrice = updatedTotal;
    totalPriceEl.innerText = totalPrice.toFixed(2);

    if (rows.length === 0) {
        renderEmptyRow();
    }
}

function setButtonState(button, isAdded, quantity = 0) {
    button.classList.toggle("remove-state", isAdded);
    button.innerHTML = isAdded
        ? `Remove (${quantity}) <ion-icon name="remove-circle-outline"></ion-icon>`
        : 'Add <ion-icon name="add-circle-outline"></ion-icon>';
}

function clearCart() {
    addedItems.forEach((item) => {
        item.row.remove();
        setButtonState(item.button, false);
    });

    addedItems.clear();
    refreshCart();
}

function getCartSummary() {
    const lines = [];
    addedItems.forEach((item, serviceId) => {
        const row = cartBody.querySelector(`tr[data-service-id="${serviceId}"]`);
        const name = row?.querySelector(".service-name")?.innerText || "Service";
        const lineTotal = (item.unitPrice * item.quantity).toFixed(2);
        lines.push(`${name} x ${item.quantity} = Rs ${lineTotal}`);
    });
    return lines.join("\n");
}

function buildTemplateParams(details) {
    const {
        name,
        email,
        phone,
        total,
        services
    } = details;

    return {
        to_email: email,
        recipient_email: email,
        email,
        admin_email: ADMIN_EMAIL,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        services,
        total_amount: `Rs ${total.toFixed(2)}`,
        user_name: name,
        user_email: email,
        user_phone: phone,
        service_name: services
    };
}

async function sendBookingEmail(details) {
    const hasEmailJsConfig =
        typeof emailjs !== "undefined" &&
        EMAILJS_CONFIG.publicKey &&
        EMAILJS_CONFIG.serviceId &&
        EMAILJS_CONFIG.templateId &&
        !EMAILJS_CONFIG.publicKey.includes("YOUR_") &&
        !EMAILJS_CONFIG.serviceId.includes("YOUR_") &&
        !EMAILJS_CONFIG.templateId.includes("YOUR_");

    if (typeof emailjs === "undefined") {
        throw new Error("EmailJS SDK not loaded.");
    }

    if (!hasEmailJsConfig) {
        throw new Error("EmailJS config missing. Check publicKey/serviceId/templateId in index.html.");
    }

    const templateParams = buildTemplateParams(details);

    const userMailResult = await emailjs
        .send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
                ...templateParams,
                to_email: details.email,
                recipient_email: details.email,
                email: details.email
            },
            { publicKey: EMAILJS_CONFIG.publicKey }
        )
        .then(() => ({ ok: true, target: "user" }))
        .catch((err) => ({ ok: false, target: "user", error: err }));

    const adminMailResult = await emailjs
        .send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            {
                ...templateParams,
                to_email: ADMIN_EMAIL,
                recipient_email: ADMIN_EMAIL,
                email: ADMIN_EMAIL
            },
            { publicKey: EMAILJS_CONFIG.publicKey }
        )
        .then(() => ({ ok: true, target: "admin" }))
        .catch((err) => ({ ok: false, target: "admin", error: err }));

    if (!userMailResult.ok) {
        const userError = userMailResult.error?.text || userMailResult.error?.message || "User email send failed.";
        throw new Error(userError);
    }

    return {
        userSent: true,
        adminSent: adminMailResult.ok
    };
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
          <p><strong>No items added</strong></p>
          <p>Add items to the cart from the service bar</p>
        </div>
      </td>
    `;
    cartBody.appendChild(row);
}

bookingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    if (addedItems.size === 0) {
        alert("Please add at least one service before booking.");
        return;
    }

    const name = document.getElementById("customer-name").value;
    const email = document.getElementById("customer-email").value;
    const phone = document.getElementById("customer-phone").value;
    const cartSummary = getCartSummary();
    const bookingDetails = {
        name,
        email,
        phone,
        total: totalPrice,
        services: cartSummary
    };

    if (bookingSubmitBtn) {
        bookingSubmitBtn.disabled = true;
        bookingSubmitBtn.innerText = "Sending...";
    }

    try {
        const result = await sendBookingEmail(bookingDetails);

        const adminNote = result.adminSent ? "" : "\n\nNote: Admin email not sent.";
        alert(`Booking Successful!\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nTotal: Rs ${totalPrice.toFixed(2)}${adminNote}`);
        this.reset();
        clearCart();
    } catch (error) {
        const msg = error?.text || error?.message || "Unknown error";
        alert(`Automatic email failed: ${msg}`);
        console.error(error);
    } finally {
        if (bookingSubmitBtn) {
            bookingSubmitBtn.disabled = false;
            bookingSubmitBtn.innerText = "Confirm Booking";
        }
    }
});
