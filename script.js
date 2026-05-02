// cart items stored here
var cartItems = []

var cartBody = document.getElementById("cart-row")
var totalPriceEl = document.getElementById("total-price")
var addButtons = document.querySelectorAll(".Add-items")
var bookingForm = document.getElementById("booking-form")
var bookingMessage = document.getElementById("booking-success-message")
var subscribeBtn = document.querySelector(".subscribe-button")
var subInputs = document.querySelectorAll(".subscribe-input")
var newsletterMsg = document.getElementById("newsletter-message")

// book button scroll
var bookBtn = document.querySelector(".book")
var servSec = document.querySelector(".services")

if (bookBtn) {
    bookBtn.addEventListener("click", function(e) {
        e.preventDefault()
        servSec.scrollIntoView({ behavior: "smooth" })
    })
}

// show empty message when no items
function showEmptyRow() {
    cartBody.innerHTML = '<tr class="reflect-row" id="reflect"><td colspan="3"><div class="empty"><ion-icon name="information-circle-outline"></ion-icon><p><strong>No items added</strong></p><p>Add items to the cart from the service bar</p></div></td></tr>'
}

// calculate total
function getTotalPrice() {
    var total = 0
    for (var i = 0; i < cartItems.length; i++) {
        total = total + (cartItems[i].price * cartItems[i].qty)
    }
    return total
}

// redraw the cart table
function renderCart() {
    if (cartItems.length == 0) {
        showEmptyRow()
        totalPriceEl.innerText = "0.00"
        return
    }

    var html = ""
    for (var i = 0; i < cartItems.length; i++) {
        var item = cartItems[i]
        var lineTotal = item.price * item.qty

        html = html + "<tr>"
        html = html + "<td>" + (i + 1) + "</td>"
        html = html + "<td><div class='service-line'><span>" + item.name + "</span>"
        html = html + "<button type='button' class='qty-btn qty-minus' data-index='" + i + "'>-</button>"
        html = html + "<span>" + item.qty + "</span>"
        html = html + "<button type='button' class='qty-btn qty-plus' data-index='" + i + "'>+</button>"
        html = html + "</div></td>"
        html = html + "<td>₹" + lineTotal.toFixed(2) + "</td>"
        html = html + "</tr>"
    }

    cartBody.innerHTML = html
    totalPriceEl.innerText = getTotalPrice().toFixed(2)
}

// get service name and price from the clicked row
function getServiceInfo(btn) {
    var row = btn.parentElement
    var txt = row.querySelector("div").innerText
    var name = txt.split("-")[0].trim()
    var priceText = row.querySelector(".price").innerText
    // remove currency symbol
    var price = parseFloat(priceText.replace("₹", "").replace(",",""))
    return { name: name, price: price }
}

// add to cart or increase qty if already there
function addToCart(name, price) {
    var found = false
    for (var i = 0; i < cartItems.length; i++) {
        if (cartItems[i].name == name) {
            cartItems[i].qty = cartItems[i].qty + 1
            found = true
            break
        }
    }
    if (found == false) {
        cartItems.push({ name: name, price: price, qty: 1 })
    }
    renderCart()
}

function increaseQty(index) {
    cartItems[index].qty = cartItems[index].qty + 1
    renderCart()
}

function decreaseQty(index) {
    cartItems[index].qty = cartItems[index].qty - 1
    if (cartItems[index].qty <= 0) {
        cartItems.splice(index, 1)
    }
    renderCart()
}

// add button click
for (var i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener("click", function() {
        var info = getServiceInfo(this)
        addToCart(info.name, info.price)
    })
}

// plus minus buttons inside cart
cartBody.addEventListener("click", function(e) {
    var btn = e.target
    if (btn.classList.contains("qty-plus")) {
        var idx = parseInt(btn.dataset.index)
        increaseQty(idx)
    }
    if (btn.classList.contains("qty-minus")) {
        var idx = parseInt(btn.dataset.index)
        decreaseQty(idx)
    }
})

// booking form submit
if (bookingForm) {
    bookingForm.addEventListener("submit", function(e) {
        e.preventDefault()

        if (cartItems.length == 0) {
            alert("Please add at least one service to the cart first!")
            return
        }

        var nameVal = bookingForm.querySelector('input[type="text"]').value.trim()
        var emailVal = bookingForm.querySelector('input[type="email"]').value.trim()
        var phoneVal = bookingForm.querySelector('input[type="tel"]').value.trim()

        if (nameVal == "" || emailVal == "" || phoneVal == "") {
            alert("Please fill all the details.")
            return
        }

        // make summary text
        var summary = ""
        for (var i = 0; i < cartItems.length; i++) {
            var item = cartItems[i]
            summary = summary + item.name + " x" + item.qty + " = Rs " + (item.price * item.qty).toFixed(2) + "\n"
        }

        var total = getTotalPrice()
        alert("Booking Successful!\n\nName: " + nameVal + "\nEmail: " + emailVal + "\nPhone: " + phoneVal + "\n\nServices:\n" + summary + "\nTotal: Rs " + total.toFixed(2))

        if (bookingMessage) {
            bookingMessage.innerText = "Thank you! Your booking is submitted."
        }

        bookingForm.reset()
        cartItems = []
        renderCart()
    })
}

// newsletter subscribe
if (!newsletterMsg) {
    newsletterMsg = document.createElement("p")
    newsletterMsg.id = "newsletter-message"
    newsletterMsg.style.marginTop = "10px"
    subscribeBtn.parentElement.appendChild(newsletterMsg)
}

if (subscribeBtn) {
    subscribeBtn.addEventListener("click", function(e) {
        e.preventDefault()
        var name = subInputs[0].value.trim()
        var email = subInputs[1].value.trim()

        if (name == "" || email == "") {
            newsletterMsg.style.color = "red"
            newsletterMsg.innerText = "Please fill full name and email."
            return
        }

        newsletterMsg.style.color = "green"
        newsletterMsg.innerText = "Thank you " + name + ", you have subscribed!"
        subInputs[0].value = ""
        subInputs[1].value = ""
    })
}

renderCart()
