let buttons= document.querySelectorAll(".Add-items");
let cartBody = document.querySelector("#cart-body");
let emptyRow = document.querySelector("#empty-row");
let totalPrice = document.querySelector("#total-price");

let count = 1;
let total = 0;

for(let i=0; i<buttons.length; i++){
    buttons[i].addEventListener("click",() => {

        if(emptyRow){
            emptyRow.remove();
            emptyRow = null ;
        }

        let services = buttons[i].parentElement.querySelector("div").textContent;

        let parts= services.split("-");

        let serviceName = parts[0].trim();

        let price = parts[1].replace("₹","").trim();

        let row = document.createElement("tr");

        row.innerHTML = `
            <td>${count}</td>
            <td>${serviceName}</td>
            <td>${price}</td>
        `;

        cartBody.appendChild(row);

        count++;

        total += Number(price);

        totalPrice.textContent = total;
    })

}