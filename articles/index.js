import { appTimeline } from "../app.js";
import { useBranch, useHeadTitle, useRouter } from "../composables/index.js";
import { Article, ArticleRenderer, ArticleManager } from "./index.module.js";
import { AsideRenderer } from "../renderer.module.js";
import { articles as _articles, categories, tags } from "../exports.js";

import { Marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import "https://cdn.jsdelivr.net/npm/marked-highlight@2.1.1/lib/index.umd.min.js";

(async () => {
  const rootContainer = document.querySelector("article");

  const getTagURL = (tag) => `../tags/index.html?id=${tag}`;
  const getCategoryURL = (category) =>
    `../categories/index.html?id=${category}`;
  const getArticleURL = (article) => {
    return `index.html?id=${article.id}`;
  };

  function createArticleHeader(article) {
    const header = document.createElement("header");
    header.classList.add("mb-4");

    const fragment = document.createDocumentFragment();

    const h1 = document.createElement("h1");
    const icon = document.createElement("i");
    icon.className = "fa fa-chevron-left fa-xs me-2 cursor-pointer link";
    icon.onclick = () => history.back();
    h1.appendChild(icon);
    h1.appendChild(document.createTextNode(article.title));

    const metaContent = document.createElement("div");
    metaContent.classList.add("text-muted", "fst-italic", "mb-2");
    metaContent.textContent = `Posted on ${article.getFormattedDate()} by ${
      article.author
    }`;

    const categories = article.categories.map((category) => {
      const a = document.createElement("a");
      a.href = getCategoryURL(category);
      a.className =
        "badge bg-secondary text-decoration-none link-light me-1 d-inline-block";
      a.textContent = category;
      return a;
    });

    fragment.appendChild(h1);
    fragment.appendChild(metaContent);
    categories.forEach((category) => fragment.appendChild(category));

    header.appendChild(fragment);
    return header;
  }

  async function createArticleSection(article) {
    const section = document.createElement("section");
    section.classList.add("mb-5");
    if (article.isMD) {
      section.classList.add("revert-browser-stylesheet");
    }
    section.innerHTML = await article.getContent();
    ArticleRenderer.renderArticleCodeLineNumbersBlock(section, hljs);
    return section;
  }

  function createArticleFooter(article) {
    const prevArticle = articles[articles.indexOf(article) - 1];
    const nextArticle = articles[articles.indexOf(article) + 1];

    const footer = document.createElement("footer");
    footer.className = "article-footer";
    footer.innerHTML = `
    <!-- tags -->
    ${
      article.tags
        ? `<div class="article-tags">${article.tags
            .map((tag) => `<a href="${getTagURL(tag)}"># ${tag}</a>`)
            .join("")}</div>`
        : ""
    }
    <div class="article-nav">
      <div class="article-nav-item">
        ${
          prevArticle
            ? `<a href="${getArticleURL(
                prevArticle
              )}"><i class="fa fa-chevron-left fa-xs"></i>${
                prevArticle.title
              }</a>`
            : ""
        }
      </div>
      <div class="article-nav-item">
        <a href="#!">
          ${
            nextArticle
              ? `<a href="${getArticleURL(nextArticle)}">${
                  nextArticle.title
                }<i class="fa fa-chevron-right fa-xs"></i></a>`
              : ""
          }
        </a>
      </div>
    `;

    return footer;
  }

  // January 1, 2023
  /**
   *
   * @param {Article} article
   */
  async function renderArticle(article) {
    const header = createArticleHeader(article);
    const section = await createArticleSection(article);
    const footer = createArticleFooter(article);

    rootContainer.appendChild(header);
    rootContainer.appendChild(section);
    rootContainer.appendChild(footer);
  }

  // const c = new CopyButtonPlugin({
  //   callback: (text, el) => console.log("Copied to clipboard", text),
  // });
  // hljs.addPlugin(c);
  // hljs.addPlugin({
  //   "after:highlightElement": ({ el, result }) => {
  //     console.log("el :>> ", el);
  //     // move the language from the result into the dataset
  //     el.dataset.language = result.language;
  //   },
  // });
  const marked = new Marked(
    markedHighlight.markedHighlight({
      langPrefix: "hljs language-",
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : "plaintext";
        const text = hljs.highlight(code, { language }).value;
        return text;
      },
    })
  );
  const articleManager = new ArticleManager(_articles, marked);
  const articles = articleManager.articles;

  // 調整動畫
  const startLabelName = "start";
  appTimeline.addLabel(startLabelName);
  appTimeline.from(
    rootContainer,
    {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: "power1.inOut",
    },
    startLabelName
  );

  const router = useRouter();
  const id = router.query.id;

  useBranch(id, {
    onTrue() {
      const article = articleManager.getArticle(id);
      useHeadTitle(article.title);
      renderArticle(article);
    },
    onFalse() {
      ArticleRenderer.renderArticlesTimeline({
        container: rootContainer,
        articles,
        getArticleURL: getArticleURL,
      });
      ArticleRenderer.initAnimation();
    },
    onFinally() {
      const asideRenderer = new AsideRenderer(appTimeline);
      asideRenderer.renderCategories({
        items: categories,
        getURL: getCategoryURL,
        timelineLabel: startLabelName,
      });
      asideRenderer.renderTags({
        items: tags,
        getURL: getTagURL,
        timelineLabel: startLabelName,
      });
    },
  });

  // renderSearch();
})();
