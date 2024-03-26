import { arrayChunk } from "./utils/array.js";
import { PaginatedData } from "./composables/index.js";

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
            ${items
              .map(
                (item) => `<li><a href="${getItemURL(item)}">${item}</a></li>`
              )
              .join("")}
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
  renderCategories({
    items,
    maxShowCount = Infinity,
    getURL,
    title = "所有分類",
  }) {
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

class PaginationRenderer {
  /**
   *
   * @param {HTMLElement} [container]
   */
  constructor(container = document.querySelector("nav")) {
    this.container = container;
  }

  /**
   * @param {PaginatedData} data
   */
  renderPagination(data) {
    console.log("data :>> ", data);
    const createPageItem = (
      page,
      text = page,
      tabindex = undefined,
      disabled = undefined
    ) => {
      const li = document.createElement("li");
      li.className = `page-item ${disabled ? "disabled" : ""}`;
      if (tabindex) {
        li.setAttribute("tabindex", tabindex);
      }
      if (disabled !== undefined) {
        li.setAttribute("aria-disabled", disabled ? "true" : "false");
      }
      const button = document.createElement("button");
      button.className = "page-link";
      button.textContent = text;
      li.appendChild(button);

      li.addEventListener("click", () => {
        if (disabled) {
          return;
        }
        data.goToPage(page);
      });
      return li;
    };

    const ul = document.createElement("ul");
    ul.className = "pagination justify-content-center";
    ul.appendChild(createPageItem(1, "第一頁", -1, data.currentPage === 1));
    ul.appendChild(
      createPageItem(data.currentPage - 1, "上一頁", -1, !data.hasPrevPage)
    );

    for (let i = 1; i <= data.pageCount; i++) {
      const li = createPageItem(i);
      if (i === data.currentPage) {
        li.classList.add("active");
      }
      ul.appendChild(li);
    }

    ul.appendChild(
      createPageItem(data.currentPage + 1, "下一頁", -1, !data.hasNextPage)
    );
    ul.appendChild(
      createPageItem(
        data.pageCount,
        "最後一頁",
        -1,
        data.currentPage === data.pageCount
      )
    );

    // <!--<li class="page-item disabled"><a class="page-link" href="#!">...</a></li>
    //     <li class="page-item"><a class="page-link" href="#!">15</a></li>-->
    this.container.appendChild(ul);
  }
}

export { AsideRenderer, PaginationRenderer };
