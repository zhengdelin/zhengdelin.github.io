class CategoryManager {
  /** @type {string} */
  categories = [];
  constructor() {}

  async fetchCategories(filepath = "../data/categories.json") {
    const res = await fetch(filepath);
    const categories = await res.json();
    for (const category of categories) {
      this.categories.push(category);
    }
    return this.categories;
  }
}

async function useCategoryManager({ filepath, fetch = true } = {}) {
  const categoryManager = new CategoryManager();
  if (fetch) await categoryManager.fetchCategories(filepath);
  return {
    categoryManager,
    categories: categoryManager.categories,
  };
}

export { CategoryManager, useCategoryManager };
