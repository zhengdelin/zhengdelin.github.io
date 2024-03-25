import { AsideRenderer } from "./renderer.module.js";
import {  Article, ArticleManager } from "./articles/index.module.js";
import { arrayChunk } from "./utils/array.js";
import { usePaginatedData } from "./composables/index.js";
import _articles from "./data/articles.json" with { type: "json" };
import categories from "./data/categories.json" with { type: "json" };
import tags from "./data/tags.json" with { type: "json" };

(async () => {
  const getArticleURL = (article) => `./articles/index.html?id=${article.id}`;

  const articleManager = new ArticleManager(_articles);
  const articles = articleManager.sortArticlesByDate();
  const asideRenderer = new AsideRenderer();

  asideRenderer.renderCategories({ items: categories, getURL: (category) => `./categories/index.html?id=${category}` });
  asideRenderer.renderTags({ items: tags, getURL: (tag) => `./tags/index.html?id=${tag}` });

  const articlesContainer = document.querySelector("#articles");
  const page = new URL(location.href).searchParams.get("page");
  const paginatedData = usePaginatedData(articles, Number(page || 1), 5);

  console.log('paginatedData :>> ', paginatedData);
  if (!paginatedData.items.length) {
    return;
  }
  renderArticles(paginatedData.items);
  renderPagination(paginatedData, (page) => `./index.html?page=${page}`);
  /**
   *
   * @param {Article} article
   */
  function createArticleCard(article) {
    const card = document.createElement("div");
    card.className = "card mb-4";
    card.innerHTML = `
    <!-- <a href="#!"><img class="card-img-top" src="https://dummyimage.com/700x350/dee2e6/6c757d.jpg" alt="..." /></a>-->
                                <div class="card-body">
                                    <div class="small text-muted">${article.getFormattedDate()}</div>
                                    <h2 class="card-title h4">${article.title}</h2>
                                    ${article.description ? `<p class="card-text">${article.description}</p>` : ""}
                                    <a class="btn btn-primary" href="${getArticleURL(article)}">閱讀更多 →</a>
                                </div>
    `;
    return card;
  }

  /**
   *
   * @param {Article[]} articles
   */
  function renderArticles(articles) {
    const _create = (article, row) => {
      const col = document.createElement("div");
      col.className = "col-lg-6";

      row.appendChild(col);
      col.appendChild(createArticleCard(article));
    };
    const [firstArticle, ...restArticles] = articles;
    articlesContainer.appendChild(createArticleCard(firstArticle));
    for (const [article1, article2] of arrayChunk(restArticles, 2)) {
      const row = document.createElement("div");
      row.className = "row";
      articlesContainer.appendChild(row);
      _create(article1, row);

      if (article2) {
        _create(article2, row);
      }
    }
  }

  /**
   * @param {ReturnType<typeof usePaginatedData>} data
   * @param {(number) => string} getPageUrl
   */
  function renderPagination(data, getPageUrl) {
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Pagination");
    console.log("data :>> ", data);
    nav.innerHTML = `
    <hr class="my-0" />
    <ul class="pagination justify-content-center my-4">
        <li class="page-item ${!data.hasPrevPage ? "disabled" : ""}"><a class="page-link" href="${getPageUrl(
      data.currentPage - 1
    )}" tabindex="-1" aria-disabled="${!data.hasPrevPage}">上一頁</a></li>
        ${Array.from({ length: data.pageCount })
          .map((_, i) => {
            const idx = i + 1;
            return `<li class="page-item ${idx === data.currentPage ? "active" : ""}"><a class="page-link" href="${getPageUrl(idx)}">${idx}</a></li>`;
          })
          .join("")}
        <!--<li class="page-item disabled"><a class="page-link" href="#!">...</a></li>
        <li class="page-item"><a class="page-link" href="#!">15</a></li>-->
        <li class="page-item ${!data.hasNextPage ? "disabled" : ""}"><a class="page-link" href="${getPageUrl(
      data.currentPage + 1
    )}" aria-disabled="${!data.hasNextPage}">下一頁</a></li>
    </ul>
    `;

    articlesContainer.appendChild(nav);
  }
})();
