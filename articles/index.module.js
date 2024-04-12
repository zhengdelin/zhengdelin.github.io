import { formatTime } from "../utils/time.js";

/**
 * @typedef MDConfig
 * @property {boolean} [removeH1]
 * @property {string[] | string} [highlightContents] 高亮文字內容 僅在 `pre code` 標籤中生效，若為 array 表示替換多組文字，若為 string 表示替換單組文字或 regexp
 * @property {Record<string, string>} [highlightContentsStyles]
 */

class TemplateStringParser {
  /** @type {Record<string, string>} */
  variables;
  /** @type {RegExp} */
  format;
  /** @type {(substring: string, ...args: any[]) => string)} */
  _replacer;

  /**
   * @param {Object} param0
   * @param {TemplateStringParser['variables']} [param0.variables]
   * @param {TemplateStringParser['format']} [param0.format]
   * @param {TemplateStringParser['_replacer']} [param0.replacer]
   * @
   */
  constructor({ variables = {}, format = /\{\{(.*?)\}\}/g, replacer }) {
    this.variables = variables;
    this.format = format instanceof RegExp ? format : new RegExp(format, "g");
    this._replacer =
      replacer ||
      ((_, v) => {
        return this.variables[v];
      });
  }

  setVariable(key, value) {
    this.variables[key] = value;
  }

  /**
   * @returns
   */
  replace(text) {
    if (!text) return "";
    return text.replace(this.format, this._replacer);
  }
}

class MDParser {
  marked;
  /** @type {MDConfig} */
  config;
  /** @type {TemplateStringParser} */
  templateStringParser;
  /** @type {(id:any)=>({href:string, content:string} | null)} */
  getArticleLink;

  /**
   * @param {Object} param0
   * @param {MDParser['marked']} param0.marked
   * @param {MDParser['config']} [param0.config]
   * @param {MDParser['templateStringParser']} param0.templateStringParser
   * @param {MDParser['getArticleLink']} param0.getArticleLink
   */
  constructor({ marked, config = {}, templateStringParser, getArticleLink }) {
    this.marked = marked;
    this.config = config;
    this.templateStringParser = templateStringParser;
    this.getArticleLink = getArticleLink;
  }

  /**
   *
   * @param {HTMLImageElement[]} images
   * @returns
   */
  replaceImagesSrc(images) {
    for (const img of images) {
      const datasetSrc = img.dataset.src;
      if (!datasetSrc) continue;
      img.src = this.templateStringParser.replace(datasetSrc);
    }
  }

  handleArticleLinks(links) {
    for (const link of links) {
      const articleId = link.dataset.articleId;
      if (!articleId) continue;
      const result = this.getArticleLink(articleId);
      if (!result) continue;

      link.href = result.href;
      link.innerHTML = result.content;
    }
  }
  get highlightContentsRegex() {
    if (!this.config.highlightContents) return null;
    if (Array.isArray(this.config.highlightContents))
      return new RegExp(
        `(${this.config.highlightContents.map((x) => x).join("|")})`,
        "g"
      );
    if (typeof this.config.highlightContents === "string")
      return new RegExp(this.config.highlightContents, "g");
    if (this.config.highlightContents instanceof RegExp)
      return this.config.highlightContents;
    return null;
  }

  get highlightContentsStyleString() {
    if (!this.config.highlightContentsStyles) return "";
    return Object.entries(this.config.highlightContentsStyles)
      .map(([k, v]) => `${k}:${v}`)
      .join(";");
  }
  getReplacedHighlightContent(content) {
    const regex = this.highlightContentsRegex;
    if (!regex) return content;
    const templateStringParser = new TemplateStringParser({
      format: regex,
      replacer: (substring, ...args) => {
        return `<span style="${this.highlightContentsStyleString}">${substring}</span>`;
      },
    });

    return templateStringParser.replace(content);
  }

  replaceHighlightContents(codeBlocks) {
    for (const codeBlock of codeBlocks) {
      codeBlock.innerHTML = this.getReplacedHighlightContent(
        codeBlock.innerHTML
      );
    }
  }

  /**
   *
   * @param {string} content
   * @returns
   */
  parse(content) {
    const parsedContent = this.marked?.parse(content, { breaks: true });
    const div = document.createElement("div");
    div.innerHTML = parsedContent;
    if (this.config.removeH1) {
      div.querySelectorAll("h1").forEach((h1) => {
        h1.remove();
      });
    }

    this.replaceImagesSrc(div.querySelectorAll("img"));
    this.handleArticleLinks(div.querySelectorAll("a"));

    this.replaceHighlightContents(div.querySelectorAll("pre code"));
    return div.innerHTML;
  }
}

class Article {
  /** @type {string} */
  _id;
  /** @type {string} */
  title;
  /** @type {string} */
  description;
  /** @type {Date} */
  date;
  /** @type {'html' | 'md'} */
  type;
  /** @type {string} */
  filename;
  /**
   * 基於articles/contents資料夾底下的路徑
   * 如: 2022/01/01/chat-gpt
   * @type {string}
   **/
  fileFolderPath;

  /** @type {string[]} */
  tags;
  /** @type {string[]} */
  categories;
  /** @type {string} */
  author;

  /** @type {boolean} */
  asIframe;
  /** @type {Record<string, string>} */
  iframeAttrs;
  marked;

  /** @type {MDConfig} */
  mdConfig;

  /**
   * @typedef ArticleCreateArgs
   * @property {Article['id']} id
   * @property {Article['title']} title
   * @property {Article['description']} [description]
   * @property {Article['date'] | string} date
   * @property {Article['type']} [type]
   * @property {Article['filename']} [filename]
   * @property {Article['fileFolderPath']} [fileFolderPath]
   * @property {Article['tags']} [tags]
   * @property {Article['categories']} [categories]
   * @property {Article['asIframe']} [asIframe]
   * @property {Article['iframeAttrs']} [iframeAttrs]
   * @property {Article['marked']} [marked]
   * @property {Article['mdConfig']} [mdConfig]
   */

  /**
   *
   * @param {ArticleCreateArgs} param0
   * @param {() => ArticleManager} getArticleManager
   */
  constructor(
    {
      id,
      title,
      date,
      type = "html",
      fileFolderPath,
      filename,
      tags = [],
      categories = [],
      description = "",
      asIframe = false,
      iframeAttrs = {},
      marked,
      mdConfig = {},
    },
    getArticleManager
  ) {
    this._id = id;
    this.title = title;
    this.description = description;
    this.date = new Date(date);
    this.type = type;
    this.fileFolderPath = fileFolderPath;
    this.filename = filename;
    this.tags = tags;
    this.categories = categories;
    this.author = "Lin";
    this.asIframe = asIframe;
    this.iframeAttrs = iframeAttrs;
    this.marked = marked;
    this.mdConfig = {
      removeH1: true,
      highlightContentsStyles: {
        color: "red",
        // "font-weight": "bold",
      },
      ...mdConfig,
    };
    this.getArticleManager = getArticleManager;
  }

  get articleManager() {
    return this.getArticleManager();
  }

  /**
   *
   * @param {object} [args]
   * @param {string} [args.articlesFolderPath]
   * @param {(article:Article) => string} [args.getArticleURL]
   * @returns
   */
  async getContent({
    articlesFolderPath = ".",
    getArticleURL = ({ id }) => `../articles/index.html?id=${id}`,
  } = {}) {
    const type = this.type;
    const filename = this.filename || `index.${type}`;
    const folderPath =
      this.fileFolderPath || `${formatTime(this.date, "yyyy/M/D")}/${this._id}`;

    const fullFolderPath = `${articlesFolderPath}/contents/${folderPath}`
      .split("/")
      .filter(Boolean)
      .join("/");
    const filePath = `${fullFolderPath}/${filename}`;

    if (this.asIframe) {
      const iframeAttrs = {
        src: filePath,
        title: this.title,
        ...this.iframeAttrs,
      };
      return `<iframe ${Object.entries(iframeAttrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(" ")}></iframe>`;
    }

    try {
      const templateStringParser = new TemplateStringParser({
        variables: {
          curFolderPath: fullFolderPath,
          articlesFolderPath,
        },
      });

      const res = await fetch(filePath);
      const content = templateStringParser.replace(await res.text());

      if (this.isHTML) {
        return content;
      } else if (this.isMD) {
        const parser = new MDParser({
          marked: this.marked,
          config: this.mdConfig,
          templateStringParser: templateStringParser,
          getArticleLink: (id) => {
            const article = this.articleManager.getArticle(id);
            return article
              ? {
                  content: article.title,
                  href: getArticleURL(article),
                }
              : null;
          },
        });
        return parser.parse(content);
      }
      return "";
    } catch (error) {
      console.error(error);
      return `Error: 發現問題，請聯繫作者。`;
    }
  }

  get id() {
    return `${formatTime(this.date, "yyyyMMDD")}-${this._id}`;
  }

  get isHTML() {
    return this.type === "html";
  }

  get isMD() {
    return this.type === "md";
  }

  getFormattedDate(format = "MMM DD, yyyy") {
    return formatTime(this.date, format);
  }
}

class ArticleManager {
  /** @type {Article[]} */
  articles = [];

  constructor(marked = null) {
    /**
     * @type {Record<Article['id'], Article>}
     */
    this.articlesMap = {};
    this.marked = marked;
  }

  /**
   * @param {ArticleCreateArgs} args
   * @returns
   */
  addArticle(args) {
    const article = new Article({ ...args, marked: this.marked }, () => this);
    this.articles.push(article);
    this.articlesMap[article.id] = article;
    return article;
  }

  /**
   *
   * @param {ArticleCreateArgs[]} articles
   */
  addArticles(articles) {
    for (const article of articles) {
      this.addArticle(article);
    }
  }

  // async fetchArticles() {
  //   const res = await fetch("../data/articles.json");
  //   const articles = await res.json();
  //   for (const article of articles) {
  //     this.addArticle(article);
  //   }
  //   return this.articles;
  // }

  getArticle(id) {
    if (!this.articlesMap[id]) {
      return null;
      // throw new Error(`Article ${id} not found`);
    }
    return this.articlesMap[id];
  }

  get articleCountsByCategory() {
    const counts = {};
    for (const article of this.articles) {
      for (const category of article.categories) {
        if (!counts[category]) {
          counts[category] = 0;
        }
        counts[category]++;
      }
    }
    return counts;
  }

  filterArticles({ tag, category, keyword }, strict = false) {
    const filterFuncs = [];
    if (tag) {
      filterFuncs.push((article) => article.tags.includes(tag));
    }
    if (category) {
      filterFuncs.push((article) => article.categories.includes(category));
    }
    if (keyword) {
      filterFuncs.push(
        (article) =>
          article.title.includes(keyword) ||
          article.description.includes(keyword)
      );
    }
    return this.articles.filter((article) =>
      filterFuncs[strict ? "every" : "some"]((func) => func(article))
    );
  }

  getArticlesByTag(tag) {
    return this.filterArticles({ tag });
  }

  getArticlesByCategory(category) {
    return this.filterArticles({ category });
  }

  getArticlesByKeyword(keyword) {
    return this.filterArticles({ keyword });
  }

  sortArticlesByDate() {
    return ArticleManager.sortArticlesByDate(this.articles);
  }

  static sortArticlesByDate(articles) {
    return articles.sort((a, b) => {
      if (b.date === a.date) {
        return 0;
      }
      return b.date > a.date ? 1 : -1;
    });
  }

  async fetchArticles(filepath = "../data/articles.json") {
    const res = await fetch(filepath);
    const articles = await res.json();
    this.addArticles(articles);
    return this.articles;
  }
}

class ArticleRenderer {
  /**
   * @typedef ArticleRendererArgs
   * @property {HTMLElement} container
   * @property {Article[]} articles
   * @property {(article: Article) => string} [getArticleURL]
   */

  static createTimelineDateTitle(content) {
    const div = document.createElement("div");
    div.classList.add("date-title");
    div.innerHTML = `<span>${content}</span>`;
    return div;
  }

  /**
   *
   * @param {Article} article
   * @param {boolean} isRight
   * @param {ArticleRendererArgs['getArticleURL']} getArticleURL
   */
  static createTimelineItem(
    article,
    isRight,
    getArticleURL = (article) => `../articles/index.html?id=${article.id}`
  ) {
    const div = document.createElement("div");
    div.className = `col-sm-6 timeline-item ${isRight ? "right" : ""}`;
    div.innerHTML = `
    <div class="timeline-card anim ${isRight ? "fadeInRight" : "fadeInLeft"}">
                <div class="timeline-content">
                  <div class="date">
                    <p>${article.date.getDate()}</p>
                    <small>${formatTime(article.date, "ddd", {
                      locale: "en",
                    })}</small>
                  </div>
                  <div class="body">
                    <h2 class="timeline-title">${article.title}</h2>
                    ${
                      article.description ? `<p>${article.description}</p>` : ""
                    }
                    <a class="read-more" href="${getArticleURL(
                      article
                    )}">閱讀更多</a>
                  </div>

                  <!-- <div class="timeline-media">
                    <a class="colorbox cboxElement" href="#">
                      <img class="img-responsive" src="https://www.bootdey.com/image/400x400/FFB6C1/000000" alt="" />
                    </a>
                  </div> -->
                </div>
                <div class="timeline-card-triangle"></div>
              </div>
              <div class="timeline-item-dot"></div>
    `;
    return div;
  }

  /**
   *
   * @param {ArticleRendererArgs} param0
   */
  static renderArticlesTimeline({
    container,
    articles,
    getArticleURL = (article) => `../articles/index.html?id=${article.id}`,
  }) {
    const timeline = document.createElement("div");
    timeline.classList.add("timeline");
    container.appendChild(timeline);

    const sortedArticles = ArticleManager.sortArticlesByDate(articles);
    // console.log("sortedArticles :>> ", sortedArticles);

    let lastYearMonth = null;
    let isRight = false;
    let row = null;

    for (const article of sortedArticles) {
      const yearMonth = formatTime(article.date, "MMM yyyy", { locale: "en" });
      if (lastYearMonth !== yearMonth) {
        lastYearMonth = yearMonth;
        timeline.appendChild(
          ArticleRenderer.createTimelineDateTitle(yearMonth)
        );
        isRight = false;
      }

      if (!isRight) {
        row = document.createElement("div");
        row.classList.add("row");
        timeline.appendChild(row);
        row.appendChild(
          ArticleRenderer.createTimelineItem(article, isRight, getArticleURL)
        );
        isRight = true;
      } else {
        row.appendChild(
          ArticleRenderer.createTimelineItem(article, isRight, getArticleURL)
        );
        isRight = false;
      }
    }
  }

  static initAnimation() {
    const ANIMATED_CLASS = "animated";
    const animationElements = document.querySelectorAll(".anim");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(ANIMATED_CLASS);
        } else {
          entry.target.classList.remove(ANIMATED_CLASS);
        }
      });
    });
    animationElements.forEach((el) => observer.observe(el));
    return observer;
  }

  static renderArticleCodeLineNumbersBlock(el, hljs) {
    el.querySelectorAll("pre code").forEach((block) => {
      hljs.lineNumbersBlock(block);
    });
  }
}

async function useArticleManager({ marked, filepath, fetch = true } = {}) {
  const articleManager = new ArticleManager(marked);
  if (fetch) await articleManager.fetchArticles(filepath);
  return {
    articleManager,
    articles: articleManager.articles,
  };
}

export { Article, ArticleManager, ArticleRenderer, useArticleManager };
