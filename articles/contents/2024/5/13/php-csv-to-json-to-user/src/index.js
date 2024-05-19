const tBody = document.querySelector("tbody");

function createRow(item) {
  const {
    f_food_id,
    f_food_name,
    f_class_name,
    f_food_desc,
    f_food_qty,
    f_food_price,
  } = item;

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${f_food_id}</td>
    <td>${f_food_name}</td>
    <td>${f_class_name}</td>
    <td>${f_food_desc}</td>
    <td>${f_food_qty}</td>
    <td>${f_food_price}</td>
  `;
  return tr;
}

function createTableRows(data) {
  const fragment = document.createDocumentFragment();
  data.forEach((item) => {
    fragment.appendChild(createRow(item));
  });

  tBody.appendChild(fragment);
}

window.addEventListener("DOMContentLoaded", () => {
  fetch("./get.php", { method: "GET" }).then(async (response) => {
    const data = await response.json();
    createTableRows(data);
  });
});
