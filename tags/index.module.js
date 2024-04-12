class TagManager {
  /**
   *  @type {string[]}
   */
  tags = [];
  constructor() {}
  async fetchTags(filepath = "../data/tags.json") {
    const res = await fetch(filepath);
    const tags = await res.json();
    for (const tag of tags) {
      this.tags.push(tag);
    }
    return this.tags;
  }
}

async function useTagManager({ filepath, fetch = true } = {}) {
  const tagManager = new TagManager();
  if (fetch) await tagManager.fetchTags(filepath);
  return {
    tagManager,
    tags: tagManager.tags,
  };
}

export { TagManager, useTagManager };
