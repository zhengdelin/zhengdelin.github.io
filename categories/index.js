import { categories } from "./export.js";
import { ArticleManager, ArticleRenderer } from "../articles/index.module.js";
import { articles as _articles } from "../articles/export.js";
import { AsideRenderer, PaginationRenderer } from "../renderer.module.js";
import {
  useBranch,
  useDebounce,
  usePaginatedData,
  useRouter,
} from "../composables/index.js";
import { tags } from "../tags/export.js";
import { appTimeline } from "../app.js";

const getURL = (category) => `index.html?id=${category}`;
const id = new URL(location.href).searchParams.get("id");

const container = document.querySelector("#contents");

const articleManager = new ArticleManager(_articles);
const asideRenderer = new AsideRenderer(appTimeline);

appTimeline.from(container, {
  y: -20,
  opacity: 0,
  duration: 0.5,
  ease: "power2.inOut",
});

useBranch(id, {
  onFalse() {
    const articleCounts = articleManager.articleCountsByCategory;
    // layout
    const header = document.createElement("header");
    header.classList.add("category-lists-header");
    const ul = document.createElement("ul");

    ul.className = "category-lists list-group";
    const nav = document.createElement("nav");
    nav.classList.add("my-3");

    container.appendChild(header);
    container.appendChild(ul);
    container.appendChild(nav);

    const paginationRenderer = new PaginationRenderer(nav);
    const router = useRouter();
    const paginatedData = usePaginatedData(
      categories,
      router.query.page || 1,
      10,
      (page, items) => {
        router.push({ query: { page } });
        render(items);
      }
    );
    // console.log("paginatedData :>> ", paginatedData);

    const renderListItems = (categories) => {
      ul.innerHTML = "";
      const fragment = document.createDocumentFragment();
      for (const category of categories) {
        const li = document.createElement("li");
        li.className =
          "list-group-item d-flex justify-content-between align-items-center";
        const a = document.createElement("a");
        a.href = getURL(category);
        a.textContent = category;

        const span = document.createElement("span");
        span.className = "badge bg-primary rounded-pill";
        span.textContent = articleCounts[category] || 0;

        li.appendChild(a);
        li.appendChild(span);
        fragment.appendChild(li);
      }

      ul.appendChild(fragment);
    };

    const render = (categories) => {
      renderListItems(categories);
      nav.innerHTML = "";
      paginationRenderer.renderPagination(paginatedData);
    };

    // header
    const h3 = document.createElement("h3");
    h3.textContent = "Category 列表";
    h3.className = "fw-bolder m-0 flex-shrink-0";
    const input = document.createElement("input");
    input.className = "form-control";
    input.oninput = useDebounce(
      (e) => {
        const value = e.target.value.toLowerCase();
        const filteredCategories = categories.filter((category) =>
          category.toLowerCase().includes(value)
        );
        paginatedData.updateItems(filteredCategories);
        render(filteredCategories);
      },
      { delay: 300 }
    );
    input.setAttribute("list", "categoriesOptions");
    input.setAttribute("id", "categoriesDataList");
    input.setAttribute("placeholder", "搜尋分類...");
    const datalist = document.createElement("datalist");
    datalist.id = "categoriesOptions";
    datalist.innerHTML = categories
      .map((category) => `<option value="${category}">`)
      .join("");
    header.appendChild(h3);
    header.appendChild(input);
    header.appendChild(datalist);

    render(paginatedData.items);
  },

  onTrue() {
    const header = document.createElement("h1");
    header.className = "fw-bolder";

    const icon = document.createElement("i");
    icon.className = "fa fa-chevron-left fa-xs me-2 cursor-pointer link";
    icon.onclick = () => history.back();

    header.appendChild(icon);
    header.appendChild(document.createTextNode("分類：" + id));
    container.appendChild(header);

    const articleManager = new ArticleManager(_articles);
    ArticleRenderer.renderArticlesTimeline({
      container,
      articles: articleManager.getArticlesByCategory(id),
      getArticleURL: (article) => `../articles/index.html?id=${article.id}`,
    });
    ArticleRenderer.initAnimation();
  },

  onFinally() {
    asideRenderer.renderTags({
      items: tags,
      getURL: (tag) => `../tags/index.html?id=${tag}`,
    });
  },
});
