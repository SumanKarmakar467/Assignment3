const buttons = document.getElementsByClassName("Add-items");
const cartBody = document.getElementById("cart-body");
const totalPrice = document.getElementById("total-price");
const emptyRow = document.getElementById("empty-row");

let total = 0;
let serialNo = 1;

for (let i = 0; i < buttons.length; i++) {

  buttons[i].addEventListener("click", function () {

    let serviceBox = buttons[i].parentElement;

    let serviceText =
      serviceBox.children[0].innerText;

    let serviceName =
      serviceText.split("-")[0];

    let price =
      parseInt(serviceText.match(/\d+/)[0]);

    // REMOVE ITEM
    if (buttons[i].innerText === "Remove Item") {

      let rows = cartBody.getElementsByTagName("tr");

      for (let j = 0; j < rows.length; j++) {

        if (
          rows[j].children.length > 1 &&
          rows[j].children[1].innerText === serviceName
        ) {

          rows[j].remove();
          break;
        }
      }

      total = total - price;
      totalPrice.innerText = total;

      buttons[i].innerText = "Add Items";

      if (cartBody.children.length === 0) {

        cartBody.innerHTML = `
          <tr id="empty-row">
            <td colspan="3">
              No Items Added
            </td>
          </tr>
        `;
      }

    }

    // ADD ITEM
    else {

      let empty = document.getElementById("empty-row");

      if (empty) {
        empty.remove();
      }

      let row = document.createElement("tr");

      row.innerHTML =
        "<td>" + serialNo + "</td>" +
        "<td>" + serviceName + "</td>" +
        "<td>₹" + price + "</td>";

      cartBody.appendChild(row);

      serialNo++;

      total = total + price;
      totalPrice.innerText = total;

      buttons[i].innerText = "Remove Item";
    }

  });

}