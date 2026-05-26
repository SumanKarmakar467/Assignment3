emailjs.init("kqFxJwxTYk-h_TuGm");

const buttons = document.querySelectorAll(".Add-items");
const cartBody = document.querySelector("#cart-body");
const emptyRow = document.querySelector("#empty-row");
const totalPrice = document.querySelector("#total-price");

let total = 0;
let serialNo = 1;

for(let i=0;i<buttons.length;i++){
    // console.log(buttons[i]);

    buttons[i].addEventListener("click", () => {


        let serviceBox = buttons[i].parentElement;
        let serviceText = serviceBox.children[0].innerText;
        let serviceName = serviceText.split("-")[0].trim();

        let price = parseInt(serviceText.match(/\d+/)[0]);

        


        // rmove the from the added items 
        if(buttons[i].innerText === "Remove items"){
            let rows = cartBody.querySelectorAll("tr");

            for(let j=0; j<rows.length;j++){
                if(rows[j].children.length>1 && rows[j].children[1].innerText === serviceName){
                    rows[j].remove();
                    break;
                }
            }

            total = total-price;
            totalPrice.innerText = total;

            buttons[i].innerText = "Add items";

            if(cartBody.children.length === 0){
                cartBody.innerHTML = `
                <tr id="empty-row">
                    <td colspan="3">
                        No items Added
                    </td>   
                </tr>
                `;
            }
            return;
        }

        // add items in the added items section 
        let emptyRow = document.querySelector("#empty-row");

        if(emptyRow){
            emptyRow.remove();
        }

        let row = document.createElement("tr");

        row.innerHTML = "<td>" + serialNo  + "</td>" +
                        "<td>" + serviceName  + "</td>" +
                        "<td>" + price  + "</td>" ;

        cartBody.appendChild(row);

        total =total + price;
        totalPrice.innerText = total;

        buttons[i].innerText = "Remove items";

        buttons[i].style.backgroundColor = "red";

        serialNo++;

    });
}

// for sending email to user email ID
const bookingForm = document.getElementById("booking-form");

const bookConform = document.getElementById("book-conform");

bookingForm.addEventListener("submit", function (e) {

    e.preventDefault();
    bookConform.innerText = "";

    let customerName = document.getElementById("customer-name").value;
    let customerEmail = document.getElementById("customer-email").value;
    let customerPhone = document.getElementById("customer-phone").value;

    if (customerName === "" || customerEmail === "" || customerPhone === "") {
        alert("Please fill all fields.");
        return;
    }

    if (total === 0) {
        alert("Please add at least one service.");

        bookConform.style.color = "red";
        bookConform.innerText ="Add the items to the cart to book";
        return;
    }

    let rows = cartBody.querySelectorAll("tr");

    let services = "";

    for (let i = 0; i < rows.length; i++) {

        if (rows[i].children.length > 1) {

            services += rows[i].children[1].innerText +" - " + rows[i].children[2].innerText +"\n";
        }
    }

    let templateParameter = {

        to_email: customerEmail,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        booked_services: services,
        total_amount: total
    };

    emailjs.send(
        "service_hbcpkyo",
        "template_irrxhsa",
        templateParameter
    )

    .then(function () {
        bookConform.style.color = "green";
        bookConform.innerText ="Email has been sent successfully";
        bookingForm.reset();
    })

    .catch(function (error) {
        console.log(error);
        alert("Failed to send email.");

    });

});

