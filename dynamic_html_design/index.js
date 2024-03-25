import { ArticleManager, ArticleRenderer } from "../articles/index.module.js";
import { articles as _articles } from "../articles/export.js";
/**********************Scroll Animation "END"************************************/

(async () => {
  const articleManager = new ArticleManager(_articles);
  const articles = articleManager.getArticlesByCategory("動態網頁設計");

  ArticleRenderer.renderArticlesTimeline({
    container: document.querySelector("#timeline-container"),
    articles,
    getArticleURL: ({ id }) => {
      return `../articles/index.html?id=${id}`;
    },
  });
  ArticleRenderer.initAnimation();
})();
