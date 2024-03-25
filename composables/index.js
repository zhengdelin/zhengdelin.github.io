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

export function usePaginatedData(items, page, pageSize) {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return {
    currentPage: page,
    pageSize,
    items: items.slice(startIndex, endIndex),
    hasNextPage: endIndex < items.length,
    hasPrevPage: page > 1,
    pageCount: Math.ceil(items.length / pageSize),
  };
}
