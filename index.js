import { AsideRenderer } from "./renderer.module.js";
import { Article, useArticleManager } from "./articles/index.module.js";
import { arrayChunk } from "./utils/array.js";
import { usePaginatedData, useRouter } from "./composables/index.js";
import { PaginationRenderer } from "./renderer.module.js";
import { appTimeline } from "./app.js";
import { useCategoryManager } from "./categories/index.module.js";
import { useTagManager } from "./tags/index.module.js";
(async () => {
  const getArticleURL = (article) => `./articles/index.html?id=${article.id}`;

  const [{ articleManager }, { tags }, { categories }] = await Promise.all([
    useArticleManager({ filepath: "./data/articles.json" }),
    useTagManager({ filepath: "./data/tags.json" }),
    useCategoryManager({ filepath: "./data/categories.json" }),
  ]);
  const articles = articleManager.sortArticlesByDate();
  const asideRenderer = new AsideRenderer(
    appTimeline,
    document.querySelector("aside")
  );

  // 文章列表
  const articlesContainer = document.querySelector("#articles");
  const router = useRouter();

  const page = router.query.page;
  const paginatedData = usePaginatedData(
    articles,
    Number(page || 1),
    5,
    (page) => {
      renderArticles();
      router.push({ query: { page } });
    }
  );
  function renderArticles() {
    articlesContainer.innerHTML = "";
    if (paginatedData.items.length === 0) {
      return;
    } else {
      renderArticleLists(paginatedData.items);
    }

    const nav = document.createElement("nav");
    articlesContainer.appendChild(nav);
    const hr = document.createElement("hr");
    nav.appendChild(hr);
    const paginationRenderer = new PaginationRenderer(nav);

    paginationRenderer.renderPagination(paginatedData);
  }

  renderArticles();

  // 定義首頁header動畫
  appTimeline.from("body > header .container", {
    y: -20,
    opacity: 0,
    duration: 0.5,
    ease: "power2.inOut",
  });

  const timelineLabelName = "articleListShow";
  appTimeline.addLabel(timelineLabelName, "-=0.5");
  appTimeline.from(
    articlesContainer,
    {
      y: -20,
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut",
    },
    timelineLabelName
  );

  asideRenderer.renderCategories({
    items: categories,
    getURL: (category) => `./categories/index.html?id=${category}`,
    timelineLabel: timelineLabelName,
  });
  asideRenderer.renderTags({
    items: tags,
    getURL: (tag) => `./tags/index.html?id=${tag}`,
    timelineLabel: timelineLabelName,
  });

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
  function renderArticleLists(articles) {
    if (!articles.length) return;
    // console.log("articles :>> ", articles);
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
