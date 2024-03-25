/**
 * @class
 * @template T
 */
class TreeNode {
  /** @type {T} */
  data;
  /** @type {TreeNode<T>[]} */
  children = [];
  /** @type {TreeNode<T> | null} */
  parentNode = null;
  /** @type {TreeNode<T> | null} */
  prevNode = null;
  /** @type {TreeNode<T> | null} */
  nextNode = null;

  /**
   *
   * @param {T | null} data
   */
  constructor(data = null) {
    this.data = data;
  }

  /**
   *
   * @param {T | ThisType<T>} dataOrNode
   * @returns
   */
  addChild(dataOrNode) {
    const child = dataOrNode instanceof TreeNode ? dataOrNode : new TreeNode(dataOrNode);
    child.parentNode = this;
    if (this.children.length > 0) {
      child.prevNode = this.children[this.children.length - 1];
      this.children[this.children.length - 1].nextNode = child;
    }
    this.children.push(child);

    return child;
  }

  /**
   *
   * @param {T} data
   */
  removeChild(data) {
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i].data === data) {
        this.children.splice(i, 1);
        break;
      }
    }
  }

  removeChildren() {
    this.children = [];
  }

  get hasChildren() {
    return this.children.length > 0;
  }

  get isRoot() {
    return this.parentNode === null;
  }

  get isLeaf() {
    return !this.hasChildren;
  }

  get depth() {
    let depth = 0;
    let node = this;
    while (!node.isRoot) {
      node = node.parentNode;
      depth++;
    }
    return depth;
  }

  /**
   *
   * @param {(node:TreeNode<T>) => any)} getPathKey
   * @returns
   */
  getPath(getPathKey = (node) => node.data) {
    let node = this;
    const path = [];
    while (!node.isRoot) {
      path.push(getPathKey(node));
      node = node.parentNode;
    }
    return path;
  }
}

/**
 * @class
 * @template T
 * @template {TreeNode<T>} TreeNodeT
 */
class Tree {
  /** @type {TreeNodeT | null} */
  root = null;

  /**
   *
   * @param {T | TreeNodeT | null} dataOrNode
   */
  constructor(dataOrNode = null) {
    if (dataOrNode) {
      this.setRoot(dataOrNode);
    }
  }

  /**
   * 深度優先遍歷
   * @param {(node:TreeNodeT) => void} fn
   */
  traversalDepthFirst(fn) {
    let node = this.root;
    while (node) {
      fn(node);
      if (node.hasChildren) {
        node = node.children[0];
      } else if (node.nextNode) {
        node = node.nextNode;
      } else {
        while (!node.isRoot && !node.nextNode) {
          node = node.parentNode;
        }
        if (node.isRoot) {
          break;
        }
        node = node.nextNode;
      }
    }
  }

  /**
   *
   * @param {T | TreeNodeT} dataOrNode
   */
  setRoot(dataOrNode) {
    this.root = dataOrNode instanceof TreeNode ? dataOrNode : new TreeNode(dataOrNode);
  }
}

// const t = new Tree(0);
// t.root.addChild(1);
// t.root.addChild(2);
// t.root.children[0].addChild(3);
// t.root.children[0].addChild(4);
// t.root.children[0].children[0].addChild(5);
// t.root.children[0].children[0].children[0].addChild(6);

// t.traversalDepthFirst((node) => {
//   console.log("node :>> ", node.data);
// });

// /**
//  * @class
//  * @template T
//  */
// class TreeNode2 extends TreeNode {
//   treeNode2Flag = true;
//   /**
//    *
//    * @param {T | null} data
//    */
//   constructor(data = null) {
//     super(data);
//   }
// }

// const treeNode2 = new TreeNode2(true);
// const tree2 = new Tree(treeNode2);
// tree2.root.addChild(new TreeNode2(false));
