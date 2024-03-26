import { AsideRenderer } from "./renderer.module.js";
import { Article, ArticleManager } from "./articles/index.module.js";
import { arrayChunk } from "./utils/array.js";
import { usePaginatedData } from "./composables/index.js";
import { categories, tags, articles as _articles } from "./exports.js";
import { PaginationRenderer } from "./renderer.module.js";

(async () => {
  const getArticleURL = (article) => `./articles/index.html?id=${article.id}`;

  const articleManager = new ArticleManager(_articles);
  const articles = articleManager.sortArticlesByDate();
  const asideRenderer = new AsideRenderer();

  asideRenderer.renderCategories({
    items: categories,
    getURL: (category) => `./categories/index.html?id=${category}`,
  });
  asideRenderer.renderTags({
    items: tags,
    getURL: (tag) => `./tags/index.html?id=${tag}`,
  });

  const articlesContainer = document.querySelector("#articles");
  const page = new URL(location.href).searchParams.get("page");
  const paginatedData = usePaginatedData(
    articles,
    Number(page || 1),
    5,
    (page) => {
      location.href = `./index.html?page=${page}`;
    }
  );

  if (!paginatedData.items.length) {
    return;
  }
  renderArticles(paginatedData.items);

  const nav = document.createElement("nav");
  articlesContainer.appendChild(nav);
  const hr = document.createElement("hr");
  nav.appendChild(hr);
  const paginationRenderer = new PaginationRenderer(nav);

  paginationRenderer.renderPagination(
    paginatedData,
    (page) => `./index.html?page=${page}`
  );
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
                                    <h2 class="card-title h4">${
                                      article.title
                                    }</h2>
                                    ${
                                      article.description
                                        ? `<p class="card-text">${article.description}</p>`
                                        : ""
                                    }
                                    <a class="btn btn-primary" href="${getArticleURL(
                                      article
                                    )}">閱讀更多 →</a>
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
})();
