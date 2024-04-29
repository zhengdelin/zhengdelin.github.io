const loginForm = document.querySelector("form");
const tBody = document.querySelector("#order-table > tbody");

function createTd(content) {
  const td = document.createElement("td");
  td.textContent = content;
  return td;
}

// const expandButtons = document.querySelectorAll('.expand-btn');
//     expandButtons.forEach(button => {
//         button.addEventListener('click', function() {
//             const detailsTable = this.parentNode.parentNode.nextElementSibling;
//             // 切換顯示或隱藏詳細資訊表格
//             detailsTable.style.display = detailsTable.style.display === 'none' ? 'table' : 'none';
//         });
//     });

function createOrderItemsTable(items) {
  const table = document.createElement("table");
  table.innerHTML = `
      <thead>
        <tr>
          <th>商品名稱</th>
          <th>數量</th>
          <th>規格</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map((item) => {
            const { product_name, quantity, specification } = item;
            return `
              <tr>
                <td>${product_name}</td>
                <td>${quantity}</td>
                <td>${Object.entries(specification)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(", ")}</td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    `;
  return table;
}

function createOrderItemsRow(items) {
  const tr = document.createElement("tr");

  const td = document.createElement("td");
  td.colSpan = 3;
  td.appendChild(createOrderItemsTable(items));

  tr.appendChild(td);
  tr.classList.add("hidden");

  return tr;
}

function createOrderRow(order) {
  const { order_id, items, created_at } = order;
  const tr = document.createElement("tr");

  tr.appendChild(createTd(order_id));
  tr.appendChild(createTd(created_at));

  const expandButton = document.createElement("button");
  expandButton.classList.add("expand-btn");
  expandButton.textContent = "展開";

  expandButton.addEventListener("click", function () {
    const detailsTable = this.parentNode.parentNode.nextElementSibling;
    console.log("🚀 ~ this.parentNode:", this.parentNode);
    console.log("🚀 ~ this:", this);
    detailsTable.classList.toggle("hidden");
  });

  const td = document.createElement("td");
  td.appendChild(expandButton);
  tr.appendChild(td);

  tBody.appendChild(tr);
  tBody.appendChild(createOrderItemsRow(items));
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(loginForm);

  const account = formData.get("account");
  const pwd = formData.get("password");

  if (!account || !pwd) {
    alert("帳號或密碼不得為空");
    return;
  }

  fetch("./main.php", {
    body: formData,
    method: "POST",
  }).then(async (response) => {
    if (response.status === 401) {
      return response.text().then(alert);
    }

    const data = await response.json();
    data.forEach(createOrderRow);
  });
});
