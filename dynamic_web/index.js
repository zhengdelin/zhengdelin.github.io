import {
  ArticleRenderer,
  useArticleManager,
} from "../articles/index.module.js";
import "../app.js";
/**********************Scroll Animation "END"************************************/

(async () => {
  const { articleManager } = await useArticleManager();
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
