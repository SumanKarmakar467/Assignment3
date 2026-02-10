document.addEventListener("DOMContentLoaded", function () {

    console.log("script.js loaded ✅");

    let cart = [];
    let total = 0;

    const serviceButtons = document.querySelectorAll(".service-btn");
    const cartBody = document.getElementById("cart-body");
    const totalPriceEl = document.getElementById("cart-total-price");
    const bookBtn = document.querySelector(".booking-btn");
    const warningText = document.querySelector(".booking-warning");

    serviceButtons.forEach(button => {
        button.addEventListener("click", function () {

            const serviceInfo = this.previousElementSibling;
            const name = serviceInfo.dataset.name;
            const price = Number(serviceInfo.dataset.price);

            const index = cart.findIndex(item => item.name === name);

            if (index !== -1) {
                // REMOVE
                cart.splice(index, 1);
                total -= price;
                this.textContent = "Add items";
                this.classList.remove("remove");
            } else {
                // ADD
                cart.push({ name, price });
                total += price;
                this.textContent = "Remove";
                this.classList.add("remove");
            }

            renderCart();
        });
    });

    function renderCart() {
        cartBody.innerHTML = "";

        if (cart.length === 0) {
            cartBody.innerHTML = `
                <tr class="cart-empty">
                    <td colspan="3">
                        <ion-icon name="information-circle-outline"></ion-icon>
                        <p>No Items Added</p>
                        <span>Add items to the cart from the services bar</span>
                    </td>
                </tr>
            `;
            totalPriceEl.textContent = "₹0";
            bookBtn.disabled = true;
            warningText.style.display = "flex";
            return;
        }

        cart.forEach((item, index) => {
            cartBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>₹${item.price}</td>
                </tr>
            `;
        });

        totalPriceEl.textContent = `₹${total}`;
        bookBtn.disabled = false;
        warningText.style.display = "none";
    }

});
