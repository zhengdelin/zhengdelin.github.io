const DEFAULT_TITLE = "Lin's Blog";

export function useHeadTitle(title) {
  if (title) {
    document.title = title + " - " + DEFAULT_TITLE;
  } else {
    document.title = DEFAULT_TITLE;
  }
}

export function useHead({ title }) {
  useHeadTitle(title);
}

/**
 * @template T
 */
export class PaginatedData {
  /**
   * 生成分頁數據。
   * @param {object} param0
   * @param {T[]} param0.items 數據項目的陣列。
   * @param {number} param0.page 當前頁碼。
   * @param {number} param0.pageSize 每頁數據量。
   * @param {(page:number, items:T[])=>void} [param0.onPageChange] 當頁碼變更時的回調函數。
   */
  constructor({ items, page, pageSize, onPageChange }) {
    this.rawItems = items;
    this.currentPage = page;
    this.pageSize = pageSize;
    this.onPageChange = onPageChange;
  }

  get startIndex() {
    return (this.currentPage - 1) * this.pageSize;
  }

  get endIndex() {
    return this.startIndex + this.pageSize;
  }

  get items() {
    return this.rawItems.slice(this.startIndex, this.endIndex);
  }

  get hasNextPage() {
    return this.endIndex < this.rawItems.length;
  }

  get hasPrevPage() {
    return this.currentPage > 1;
  }

  get pageCount() {
    return Math.ceil(this.rawItems.length / this.pageSize);
  }

  updateItems(items) {
    this.rawItems = items;
    this.currentPage = 1;
  }

  #handleSetPage(page) {
    if (page === this.currentPage) return;
    this.currentPage = page;
    this.onPageChange?.(page, this.items);
  }

  goToPage(page) {
    if (page < 1 || page > this.pageCount) {
      throw new Error("Invalid page number");
    }
    this.#handleSetPage(page);
  }

  toNextPage() {
    if (this.hasNextPage) {
      this.#handleSetPage(this.currentPage++);
    }
  }

  toPrevPage() {
    if (this.hasPrevPage) {
      this.#handleSetPage(this.currentPage--);
    }
  }

  toFirstPage() {
    this.#handleSetPage(1);
  }

  toLastPage() {
    this.#handleSetPage(this.pageCount);
  }
}

/**
 * @template T
 * 生成分頁數據。
 * @param {PaginatedData<T>['items']} items 數據項目的陣列。
 * @param {PaginatedData<T>['page']} page 當前頁碼。
 * @param {PaginatedData<T>['pageSize']} pageSize 每頁數據量。
 * @param {(PaginatedData<T>['onPageChange'])} [onPageChange] 當頁碼變更時的回調函數。
 */
export function usePaginatedData(items, page, pageSize, onPageChange) {
  return new PaginatedData({ items, page, pageSize, onPageChange });
}

/**
 * Executes a branching logic based on the given status.
 *
 * @param {boolean} status - The status used to determine the branching logic.
 * @param {object} options - An object containing callback functions for different scenarios.
 * @param {function} options.onTrue - The callback function to be executed when the status is true.
 * @param {function} options.onFalse - The callback function to be executed when the status is false.
 * @param {function} options.onFinally - The callback function to be executed regardless of the status.
 * @param {function} options.onFirst - The callback function to be executed before the branching logic.
 */
export function useBranch(status, { onTrue, onFalse, onFinally, onFirst }) {
  typeof onFirst === "function" && onFirst();
  if (status) {
    typeof onTrue === "function" && onTrue();
  } else {
    typeof onFalse === "function" && onFalse();
  }
  typeof onFinally === "function" && onFinally();
}

/**
 * @template ThisT 這個函數中的 "this" 上下文的類型。
 * @template ArgsT 函數參數的類型。
 * @param {(this: ThisT, ...args: ArgsT) => unknown} fn 要執行的函數。
 * @param {object} [param1] 參數配置對象。
 * @param {number} [param1.delay=1000] 延遲時間，以毫秒為單位。默認值為 1000 毫秒。
 * @param {boolean} [param1.immediately=false] 是否立即執行函數。默認為 false。
 * @returns {(this: ThisT, ...args: ArgsT) => void} 返回一個新的函數，該函數會在觸發後延遲一段時間再執行原始函數。
 */
export function useDebounce(fn, { delay = 1000, immediately = false } = {}) {
  let timer = null;
  if (immediately) {
    return function (...args) {
      const isFirstClick = !timer;
      clearTimeout(timer);
      if (isFirstClick) fn.apply(this, args);

      timer = setTimeout(() => {
        timer = null;
      }, delay);
    };
  }

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log("run");
      fn.apply(this, args);
    }, delay);
  };
}
