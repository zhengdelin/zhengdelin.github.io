import { useHeadTitle } from "../composables/index.js";
import { Article, ArticleRenderer, ArticleManager } from "./index.module.js";
import { AsideRenderer } from "../renderer.module.js";
import _articles from "../data/articles.json" with { type: "json" };
import categories from "../data/categories.json" with { type: "json" };
import tags from "../data/tags.json" with { type: "json" };

(async () => {
  const rootContainer = document.querySelector("article");

  const getTagURL = (tag) => `../tags/index.html?id=${tag}`;
  const getCategoryURL = (category) => `../categories/index.html?id=${category}`;
  const getArticleURL = (article) => `index.html?id=${article.id}`;

  // January 1, 2023
  /**
   *
   * @param {Article} article
   */
  async function renderArticle(article) {
    const header = document.createElement("header");
    header.classList.add("mb-4");
    header.innerHTML = `
    <!-- Post title-->
    <h1 class="fw-bolder mb-1">
      <a href="index.html"><i class="fa fa-chevron-left fa-xs"></i></a>
      ${article.title}
    </h1>
    <!-- Post meta content-->
    <div class="text-muted fst-italic mb-2">Posted on ${article.getFormattedDate()} by ${article.author}</div>
    <!-- Post categories-->
    ${article.categories
      .map(
        (category) =>
          `<a class="badge bg-secondary text-decoration-none link-light me-1 d-inline-block" href="${getCategoryURL(category)}">${category}</a>`
      )
      .join("")}
    `;

    const section = document.createElement("section");
    section.classList.add("mb-5");
    section.innerHTML = await article.getContent();

    const prevArticle = articles[articles.indexOf(article) - 1];
    const nextArticle = articles[articles.indexOf(article) + 1];

    const footer = document.createElement("footer");
    footer.className = "article-footer";
    footer.innerHTML = `
    <!-- tags -->
    ${article.tags ? `<div class="article-tags">${article.tags.map((tag) => `<a href="${getTagURL(tag)}"># ${tag}</a>`).join("")}</div>` : ""}
    <div class="article-nav">
      <div class="article-nav-item">
        ${prevArticle ? `<a href="${getArticleURL(prevArticle)}"><i class="fa fa-chevron-left fa-xs"></i>${prevArticle.title}</a>` : ""}
      </div>
      <div class="article-nav-item">
        <a href="#!">
          ${nextArticle ? `<a href="${getArticleURL(nextArticle)}">${nextArticle.title}<i class="fa fa-chevron-right fa-xs"></i></a>` : ""}
        </a>
      </div>
    `;

    rootContainer.appendChild(header);
    rootContainer.appendChild(section);
    rootContainer.appendChild(footer);
  }


  const articleManager = new ArticleManager(_articles);
  const articles = articleManager.articles;
  const id = new URL(location.href).searchParams.get("id");

  const asideRenderer = new AsideRenderer();
  asideRenderer.renderCategories({ items: categories, getURL: getCategoryURL });
  asideRenderer.renderTags({ items: tags, getURL: getTagURL });

  if (!id) {
    ArticleRenderer.renderArticlesTimeline({
      container: rootContainer,
      articles,
      getArticleURL: getArticleURL,
    });
    ArticleRenderer.initAnimation();
    return;
  }

  const article = articleManager.getArticle(id);
  useHeadTitle(article.title);
  renderArticle(article);
  // renderSearch();
})();
