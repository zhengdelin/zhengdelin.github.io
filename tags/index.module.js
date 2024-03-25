class TagManager {
  constructor(tags = []) {
    /**
     * @type {string[]}
     */
    this.tags = tags;
  }
  // async fetchTags() {
  //   const res = await fetch("../data/tags.json");
  //   const tags = await res.json();
  //   for (const tag of tags) {
  //     this.tags.push(tag);
  //   }
  //   return this.tags;
  // }
}

export { TagManager };
