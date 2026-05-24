let buttons = document.querySelectorAll(".Add-items");
let cartBody = document.querySelector("#cart-body");
let emptyRow = document.querySelector("#empty-row");
let totalPrice = document.querySelector("#total-price");

let count = 1;
let total = 0;

for (let i = 0; i < buttons.length; i++) {

    let row = null;

    buttons[i].addEventListener("click", () => {

        let services = buttons[i].parentElement.querySelector("div").textContent;

        let parts = services.split("-");

        let serviceName = parts[0].trim();

        let price = parts[1].replace("₹", "").trim();

        if (buttons[i].textContent.includes("Add")) {

            if(emptyRow) {
                emptyRow.remove();
                emptyRow = null;
            }
            row = document.createElement("tr");
         
            row.innerHTML = `
                <td>${count}</td>
                <td>${serviceName}</td>
                <td>${price}</td>
            `;
         
            cartBody.appendChild(row);
        
            count++;
        
            total += Number(price);
        
            totalPrice.textContent = total;
        
            buttons[i].textContent = "Remove";
            buttons[i].classList.add("remove-btn");
         
        }       
        else {
            row.remove();

            count--;

            total -= Number(price);

            totalPrice.textContent = total;

            buttons[i].textContent = "Add items";
            buttons[i].classList.remove("remove-btn");

        }
  });
}

let booking=document.querySelector("#booking-form");

booking.addEventListener("submit", (event) => {
    event.preventDefault();

    let name = document.querySelector("#customer-name").value;
    let email = document.querySelector("#customer-email").value;
    let phone = document.querySelector("#customer-phone").value;
    let total = document.querySelector("#total-price").textContent;
    let confirmMsg = document.querySelector("#book-conform");

    confirmMsg.innerText = "Thank you For Booking the Service We will get back to you soon!";

    console.log(name);
    console.log(email);
    console.log(phone);

    let rows = document.querySelectorAll("#cart-body tr");

    let serviceList = "";

    for(let i =0 ; i<rows.length ; i++){
        let columns = rows[i].querySelectorAll("td");

        if(columns.length === 3){
            serviceList +=
            (1+1)+(".")+
                columns[1].textContent +
                " - ₹" +
                columns[2].textContent +
                "\n";        
        }
    }
    console.log("Selected Services:- ");

    console.log(serviceList);

    console.log("The Total price is :- ",total);

    alert(`
        BOOKING CONFIRMED

        Name: ${name}
        Email: ${email}
        Phone: ${phone}

        Services:
            ${serviceList}

        Total Amount: ₹${total}

        Thank You For Choosing Our Laundry Service!
    `);
})


