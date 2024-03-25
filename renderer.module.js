import { arrayChunk } from "./utils/array.js";

function getListedItemsInnerHTML(items, maxShowCount, getItemURL) {
  items = items.slice(0, maxShowCount);
  const chunkedItems = arrayChunk(items, Math.ceil(items.length / 2));
  // console.log("🚀 ~ getListedItemsInnerHTML ~ chunkedItems:", chunkedItems);
  return `
    <div class="row">
      ${chunkedItems
        .map((items) => {
          return `
        <div class="col-sm-6">
          <ul class="list-unstyled mb-0">
            ${items.map((item) => `<li><a href="${getItemURL(item)}">${item}</a></li>`).join("")}
          </ul>
        </div>
        `;
        })
        .join("")}
    </div>
    `;
}

class AsideRenderer {
  /**
   *
   * @param {HTMLElement} [container]
   */
  constructor(container = document.querySelector("aside")) {
    this.container = container;
  }

  renderAsideCard(title, renderBody) {
    const root = document.createElement("div");
    root.className = "card mb-4";

    const header = document.createElement("header");
    header.classList.add("card-header");
    header.textContent = title;

    const body = document.createElement("div");
    body.classList.add("card-body");

    renderBody(body);

    root.appendChild(header);
    root.appendChild(body);

    this.container.appendChild(root);
  }

  renderSearch() {
    this.renderAsideCard("搜尋", (body) => {
      body.innerHTML = `
      <div class="input-group">
        <input
          class="form-control"
          type="text"
          placeholder="Enter search term..."
          aria-label="Enter search term..."
          aria-describedby="button-search"
        />
        <button class="btn btn-primary" id="button-search" type="button">
          Go!
        </button>
      </div>
      `;
    });
  }

  /**
   * @template T
   * @typedef RenderCardListParams
   * @property {T[]} items
   * @property {number} [maxShowCount]
   * @property {(item:T)=>string} getURL
   * @property {string} title
   */

  /**
   * @template T
   * @param {RenderCardListParams<T>} param0
   */
  renderCategories({ items, maxShowCount = Infinity, getURL, title = "所有分類" }) {
    this.renderAsideCard(title, (body) => {
      body.innerHTML = getListedItemsInnerHTML(items, maxShowCount, getURL);
    });
  }

  /**
   * @param {RenderCardListParams<string>} param0
   */
  renderTags({ items, maxShowCount = Infinity, getURL, title = "所有標籤" }) {
    this.renderAsideCard(title, (body) => {
      body.innerHTML = getListedItemsInnerHTML(items, maxShowCount, getURL);
    });
  }
}

export { AsideRenderer };
