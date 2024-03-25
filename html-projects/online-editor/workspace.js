class WorkspaceTreeNodeData {
  /**
   * @typedef {object} WorkspaceTreeNodeDataDoms
   * @property {HTMLDivElement} root
   * @property {HTMLDivElement} row
   * @property {HTMLDivElement} icon
   * @property {HTMLDivElement | null} children
   */

  /**
   * @type {WorkspaceTreeNodeDataDoms}
   */
  doms;
  /** @type {string} */
  id;
  /** @type {ProcessedFileSystemHandle} */
  handle;

  constructor({ id, doms, handle }) {
    this.id = id;
    this.doms = doms;
    this.handle = handle;
  }

  get path() {
    return this.id.split("/");
  }

  selectRow() {
    this.doms.row.classList.add("selected");
    // this.doms.row.scrollIntoView({
    //   behavior: "smooth",
    //   block: "nearest",
    // });
    return this;
  }

  unselectRow() {
    this.doms.row.classList.remove("selected");
    return this;
  }

  scrollToRow() {
    this.doms.children.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
    return this;
  }

  setChildren(children) {
    this.doms.children = children;
    return this;
  }

  setChildrenHeight(height) {
    this.doms.children.style.height = height;
    return this;
  }

  get isChildrenShow() {
    return this.doms.children.dataset.show === "true";
  }

  setChildrenShow(isShow) {
    this.doms.children.dataset.show = isShow ? "true" : "false";
    return this;
  }

  setIcon(icon) {
    this.doms.icon.innerHTML = icon;
    return this;
  }

  get isDirectoryHandle() {
    return isDirectoryHandle(this.handle);
  }

  get isFileHandle() {
    return isFileHandle(this.handle);
  }

  // save
  async save(text) {
    if (!isFileHandle(this.handle)) return;

    const writableFileStream = await this.handle.createWritable({});
    await writableFileStream.write(text);
    writableFileStream.close();
    console.log("write complete");
    // writer.close();
    // if (writableFileStream.locked) return;
    // await writableFileStream.write({ type: "write", data: text });
    // await writableFileStream.close();

    // const accessHandle = await this.handle.createSyncAccessHandle();
    // await accessHandle.write(text);
    // accessHandle.close();
  }
}

/**
 * @extends {TreeNode<WorkspaceTreeNodeData>}
 */
class WorkspaceTreeNode extends TreeNode {
  static icons = {
    chevronDown: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><title>chevron-down</title><path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" /></svg>`,
    chevronRight: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><title>chevron-right</title><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>`,
  };

  get isShow() {
    return this.data.isChildrenShow;
  }

  set isShow(value) {
    this.data.setChildrenShow(value);
  }

  selectRow() {
    this.data.selectRow();
  }

  unselectRow() {
    this.data.unselectRow();
  }

  /**
   * @deprecated 由於parent資料夾要sticky再上層，children若為overflow:hidden則不能使用position:sticky屬性，而取消overflow:hidden則無法做展開動畫
   */
  updateParentHeightAuto() {
    // console.log("updateParentHeightAuto");
    // 更新所有parent的高度為auto才可以收起
    let curNode = this.parentNode;
    while (curNode) {
      // console.log("curNode.data.doms.root :>> ", curNode.data.doms.root);
      curNode.data.setChildrenHeight("auto");
      curNode.isShow = true;
      curNode = curNode.parentNode;
    }
  }

  showFolder() {
    if (this.isShow || this.data.isFileHandle) return;
    this.isShow = true;
    this.data.setIcon(WorkspaceTreeNode.icons.chevronDown);

    /**
     * @deprecated 由於parent資料夾要sticky再上層，children若為overflow:hidden則不能使用position:sticky屬性，而取消overflow:hidden則無法做展開動畫
     */
    // 展開動畫
    // const dynamicHeightTransition = useDynamicHeightTransition(this.data.doms.children);
    // dynamicHeightTransition.show().then(() => {
    //   this.updateParentHeightAuto();
    // });
  }

  hideFolder() {
    if (!this.isShow || this.data.isFileHandle) return;
    this.isShow = false;
    this.data.setIcon(WorkspaceTreeNode.icons.chevronRight);

    /**
     * @deprecated 由於parent資料夾要sticky再上層，children若為overflow:hidden則不能使用position:sticky屬性，而取消overflow:hidden則無法做展開動畫
     */
    // const dynamicHeightTransition = useDynamicHeightTransition(this.data.doms.children);
    // dynamicHeightTransition.hide().then(() => {
    //   this.updateParentHeightAuto();
    // });
  }

  get isSticky() {
    if (!this.hasChildren) return false;
    const rowRect = this.data.doms.row.getBoundingClientRect();
    const childrenRect = this.data.doms.children.getBoundingClientRect();
    return rowRect.bottom > childrenRect.top;
  }
}

const t = new WorkspaceTreeNode();

class Workspace {
  /** @type {WorkspaceTreeNode | null} */
  selectedNode = null;
  /** @type {WorkspaceTree[]} */
  trees = [];

  /**
   *
   * @param {WorkspaceTreeNode} node
   */
  setSelectedNode(node) {
    // console.log("this.selectedNode :>> ", this.selectedNode, node);
    if (this.selectedNode) {
      this.selectedNode.unselectRow();
    }
    node.selectRow();
    this.selectedNode = node;
  }

  addTree(tree) {
    this.trees.push(tree);
  }
}
const workspace = new Workspace();

(() => {
  const doms = {
    workspace: document.querySelector(".workspace"),
    btn: document.querySelector("#open-directory-btn"),
  };

  doms.btn.onclick = () => {
    showDirPicker();
  };

  async function showDirPicker() {
    /** @type {FileSystemDirectoryHandle} */
    const handle = await showDirectoryPicker();
    await processHandle(handle);
    sortHandle(handle);

    const tree = new Tree();
    workspace.addTree(tree);
    renderHandle(handle, tree);

    // console.log("workspace :>> ", workspace);
  }

  /**
   * @param {FileSystemDirectoryHandle} handle
   */
  async function processHandle(handle) {
    if (isFileHandle(handle)) return;
    const entries = handle.entries();
    handle.children = [];
    for await (const entry of entries) {
      await processHandle(entry[1]);
      handle.children.push(entry[1]);
    }
  }

  /**
   *
   * @param {ProcessedFileSystemHandle} handle
   */
  function sortHandle(handle) {
    if (handle.children?.length) {
      handle.children.sort((a, b) => {
        if (a.kind !== b.kind) {
          return a.kind === "directory" ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
      for (const child of handle.children) {
        sortHandle(child);
      }
      123;
    }
  }

  /**
   * @param {string} filename
   * @param {WorkspaceTreeNode} treeNode
   */
  function getTreeNodeId(filename, treeNode) {
    if (treeNode.isRoot) return filename;
    return treeNode.parentNode.data.id + "/" + filename;
  }

  /**
   *
   * @param {ProcessedFileSystemHandle} handle
   * @param {WorkspaceTree} tree
   * @param {object} param3
   * @param {number} param3.depth
   * @param {HTMLElement} param3.parent
   * @param {WorkspaceTreeNode | null} param3.parentTreeNode
   */
  function renderHandle(handle, tree, { parent = doms.workspace, depth = 0, parentTreeNode = null } = {}) {
    // 將目錄加入資料結構
    const treeNode = new WorkspaceTreeNode();
    if (parentTreeNode) {
      parentTreeNode.addChild(treeNode);
    } else {
      tree.setRoot(treeNode);
    }

    // 建立目錄
    const rootDom = document.createElement("div");
    rootDom.setAttribute("style", `--depth: ${depth}`);
    rootDom.classList.add("tree-node");
    parent.appendChild(rootDom);

    const rowId = getTreeNodeId(handle.name, treeNode);

    // 建立行
    const { row, icon } = createRow(handle, rowId);
    rootDom.appendChild(row);

    treeNode.data = new WorkspaceTreeNodeData({
      id: rowId,
      doms: {
        root: rootDom,
        row,
        icon,
        children: null,
      },
      handle,
    });

    if (handle.children && isDirectoryHandle(handle)) {
      const children = document.createElement("div");
      children.classList.add("children");
      rootDom.appendChild(children);
      treeNode.data.setChildren(children);
      treeNode.data.setChildrenShow(false);

      for (const child of handle.children) {
        //   console.log("child :>> ", child);
        renderHandle(child, tree, { parent: children, depth: depth + 1, parentTreeNode: treeNode });
      }

      registerRowExpandOnClick(treeNode, tree);
    } else {
      // 檔案
      row.addEventListener("click", function () {
        workspace.setSelectedNode(treeNode);
        openFile(treeNode, workspace);
      });
    }
  }

  function createRow(handle, rowId) {
    const { kind, name } = handle;
    const row = document.createElement("div");
    row.setAttribute("data-kind", kind);
    row.setAttribute("data-id", rowId);
    row.classList.add("row-item");

    const icon = document.createElement("div");
    icon.classList.add("icon");
    icon.innerHTML = WorkspaceTreeNode.icons.chevronRight;
    //   console.log("row :>> ", row);
    if (isDirectoryHandle(handle)) {
      row.appendChild(icon);
    }

    const nameDom = document.createElement("div");
    nameDom.classList.add("name");
    nameDom.textContent = name;
    row.appendChild(nameDom);

    return {
      row,
      icon,
    };
  }

  /**
   *
   * @param {WorkspaceTreeNode} node
   */
  function registerRowExpandOnClick(node) {
    const { row } = node.data.doms;
    row.addEventListener("click", function () {
      workspace.setSelectedNode(node);
      if (node.data.isChildrenShow) {
        if (node.isSticky) {
          node.data.scrollToRow();
          return;
        }
        node.hideFolder();
      } else {
        node.showFolder();
      }
    });
  }
})();

/**
 * @param {FileSystemHandle} handle
 * @returns {handle is FileSystemDirectoryHandle}
 */
function isDirectoryHandle(handle) {
  return handle.kind === "directory";
}

/**
 * @param {FileSystemHandle} handle
 * @returns {handle is FileSystemFileHandle}
 */
function isFileHandle(handle) {
  return handle.kind === "file";
}

function useDynamicHeightTransition(el) {
  return {
    show() {
      return new Promise((resolve) => {
        const originalHeight = `${el.clientHeight}px`;
        el.style.height = "auto";
        const height = `${el.clientHeight}px`;
        // console.log("originalHeight, height :>> ", el, originalHeight, height);
        el.style.height = originalHeight;
        requestAnimationFrame(() => {
          el.style.height = height;
          resolve({ height, originalHeight });
        });
      });
    },
    hide() {
      return new Promise((resolve) => {
        const originalStyleHeight = el.style.height;
        const originalHeight = el.clientHeight;
        const height = "0px";

        const resolveData = {
          height: "0px",
          originalHeight: `${originalHeight}px`,
        };
        if (originalStyleHeight === "auto") {
          el.style.height = `${originalHeight}px`;
          requestAnimationFrame(() => {
            el.style.height = height;
            resolve(resolveData);
          });
        } else {
          el.style.height = height;
          resolve(resolveData);
        }
      });
    },
  };
}
