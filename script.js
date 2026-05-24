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
