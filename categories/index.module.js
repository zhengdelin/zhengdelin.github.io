class CategoryManager {
  constructor(categories = []) {
    /**
     * @type {string[]}
     */
    this.categories = categories;
  }

  // async fetchCategories() {
  //   const res = await fetch("../data/categories.json");
  //   const categories = await res.json();
  //   for (const category of categories) {
  //     this.categories.push(category);
  //   }
  //   return this.categories;
  // }
}

export { CategoryManager };
