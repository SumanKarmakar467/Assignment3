// ─── Cart State ────────────────────────────────────────────────────────────────
// Store selected services as an array of objects instead of relying on DOM refs.
// This way removing any item is safe and numbering is always recalculated.
var cartItems = [];

// ─── DOM References ─────────────────────────────────────────────────────────────
var cartBody     = document.querySelector("#cart-body");
var emptyRow     = document.querySelector("#empty-row");
var totalPrice   = document.querySelector("#total-price");
var buttons      = document.querySelectorAll(".Add-items");

// ─── Render Cart Table ───────────────────────────────────────────────────────────
// Called every time an item is added or removed.
// Re-draws all rows so the Sr. No. is always 1, 2, 3… in order.
function renderCart() {
    cartBody.innerHTML = "";

    if (cartItems.length === 0) {
        // Show the "cart is empty" message again
        var emptyTr = document.createElement("tr");
        emptyTr.id = "empty-row";
        emptyTr.innerHTML = '<td colspan="3" class="empty-state">No items added yet.</td>';
        cartBody.appendChild(emptyTr);
        totalPrice.textContent = "0";
        return;
    }

    var runningTotal = 0;

    for (var i = 0; i < cartItems.length; i++) {
        var item = cartItems[i];
        var tr = document.createElement("tr");
        tr.innerHTML =
            "<td>" + (i + 1) + "</td>" +
            "<td>" + item.name + "</td>" +
            "<td>" + item.price + "</td>";
        cartBody.appendChild(tr);
        runningTotal += item.price;
    }

    totalPrice.textContent = runningTotal;
}

// ─── Add / Remove Button Logic ───────────────────────────────────────────────────
for (var i = 0; i < buttons.length; i++) {

    // Use an IIFE to capture the correct button reference for each iteration.
    (function(btn) {

        btn.addEventListener("click", function() {

            // Read service name and price from the sibling div text, e.g.
            // "👚Dry Cleaning - ₹200.00"
            var serviceText = btn.parentElement.querySelector("div").textContent;
            var parts       = serviceText.split("-");
            var serviceName = parts[0].trim();
            // Strip the rupee symbol and any extra whitespace, then convert to number
            var priceText   = parts[1].replace("₹", "").trim();
            var price       = parseFloat(priceText);

            if (btn.textContent.trim().startsWith("Add")) {

                // Add the item to our array
                cartItems.push({ name: serviceName, price: price });

                // Update button appearance
                btn.textContent = "Remove";
                btn.classList.add("remove-btn");

            } else {

                // Find this service in the array and remove it
                for (var j = 0; j < cartItems.length; j++) {
                    if (cartItems[j].name === serviceName) {
                        cartItems.splice(j, 1);
                        break;
                    }
                }

                // Reset button appearance
                btn.textContent = "Add items";
                btn.classList.remove("remove-btn");
            }

            // Re-draw the table (fixes numbering and stale-ref bugs)
            renderCart();
        });

    })(buttons[i]);
}

// ─── Form Validation Helper ──────────────────────────────────────────────────────
function showError(inputId, message) {
    var input = document.querySelector(inputId);
    var errorEl = document.querySelector(inputId + "-error");
    input.style.border = "1px solid red";
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = "block";
    }
}

function clearError(inputId) {
    var input = document.querySelector(inputId);
    var errorEl = document.querySelector(inputId + "-error");
    input.style.border = "";
    if (errorEl) {
        errorEl.textContent = "";
        errorEl.style.display = "none";
    }
}

function validateForm(name, email, phone) {
    var isValid = true;

    // Name: must not be empty and only letters/spaces
    if (!name || name.trim().length < 2) {
        showError("#customer-name", "Please enter a valid name (at least 2 characters).");
        isValid = false;
    } else {
        clearError("#customer-name");
    }

    // Email: basic format check
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.trim())) {
        showError("#customer-email", "Please enter a valid email address.");
        isValid = false;
    } else {
        clearError("#customer-email");
    }

    // Phone: must be 10 digits
    var phoneRegex = /^[0-9]{10}$/;
    if (!phone || !phoneRegex.test(phone.trim())) {
        showError("#customer-phone", "Please enter a valid 10-digit phone number.");
        isValid = false;
    } else {
        clearError("#customer-phone");
    }

    return isValid;
}

// ─── Booking Form Submission with EmailJS ────────────────────────────────────────
var bookingForm = document.querySelector("#booking-form");
var confirmMsg  = document.querySelector("#book-conform");

bookingForm.addEventListener("submit", function(event) {
    event.preventDefault();

    var name  = document.querySelector("#customer-name").value;
    var email = document.querySelector("#customer-email").value;
    var phone = document.querySelector("#customer-phone").value;
    var total = totalPrice.textContent;

    // 1. Validate the form first
    if (!validateForm(name, email, phone)) {
        confirmMsg.style.color = "red";
        confirmMsg.textContent = "Please fix the errors above before submitting.";
        return;
    }

    // 2. Check that at least one service is selected
    if (cartItems.length === 0) {
        confirmMsg.style.color = "red";
        confirmMsg.textContent = "Please add at least one service to your cart.";
        return;
    }

    // 3. Build a readable service list for the email template
    var serviceList = "";
    for (var i = 0; i < cartItems.length; i++) {
        serviceList += (i + 1) + ". " + cartItems[i].name + " - ₹" + cartItems[i].price + "\n";
    }

    // 4. Send email via EmailJS
    //    Replace the three placeholder strings below with your own EmailJS credentials:
    //      • "YOUR_SERVICE_ID"  → e.g. "service_abc123"
    //      • "YOUR_TEMPLATE_ID" → e.g. "template_xyz456"
    //      • "YOUR_PUBLIC_KEY"  → found in EmailJS Dashboard → Account → Public Key
    //
    //    Your EmailJS template should use these variables:
    //      {{customer_name}}, {{customer_email}}, {{customer_phone}},
    //      {{selected_services}}, {{total_amount}}

    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        customer_name:     name.trim(),
        customer_email:    email.trim(),
        customer_phone:    phone.trim(),
        selected_services: serviceList,
        total_amount:      "₹" + total
    })
    .then(function() {
        confirmMsg.style.color = "green";
        confirmMsg.textContent = "✅ Booking confirmed! We will contact you shortly.";

        // Show a summary alert
        alert(
            "BOOKING CONFIRMED\n\n" +
            "Name:  " + name + "\n" +
            "Email: " + email + "\n" +
            "Phone: " + phone + "\n\n" +
            "Services:\n" + serviceList + "\n" +
            "Total Amount: ₹" + total + "\n\n" +
            "Thank you for choosing our Laundry Service!"
        );

        // Reset form and cart
        bookingForm.reset();
        cartItems = [];
        renderCart();
        buttons.forEach(function(btn) {
            btn.textContent = "Add items";
            btn.classList.remove("remove-btn");
        });

    }, function(error) {
        confirmMsg.style.color = "red";
        confirmMsg.textContent = "❌ Failed to send booking. Please try again. (Error: " + JSON.stringify(error) + ")";
        console.error("EmailJS error:", error);
    });
});