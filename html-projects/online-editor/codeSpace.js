class Tab {
  /** @type {{root: HTMLDivElement, closeBtn: HTMLDivElement, tabContent: HTMLDivElement, parentDirName: HTMLDivElement | null}} */
  doms;
  /** @type {WorkspaceTreeNode}  */
  node;
  /** @type {string} */
  text;
  /** @type {File} */
  file;
  /** @type {{root:string, parent:string} | null} */
  parentDirName = null;

  /** @type {monaco.editor.ITextModel} */
  editorModel;
  /** @type {monaco.editor.IStandaloneCodeEditor} */
  editor;

  constructor({ node, text, file, doms, editorModel, editor }) {
    /** @type {WorkspaceTreeNode} */
    this.node = node;
    this.text = text;
    this.file = file;
    this.doms = { ...doms, parentDirName: doms.parentDirName || null };
    this.editorModel = editorModel;
    this.editor = editor;

    this.node.data.handle.createWritable({ keepExistingData: true }).then((writable) => {});
  }

  close() {
    this.doms.root.remove();
    this.doms.tabContent.remove();
    this.editor.dispose();
    this.editorModel.dispose();
  }

  activate() {
    // console.log("activate :>> ", this.doms.root);
    this.doms.root.classList.add("active");
    this.doms.tabContent.classList.add("active");
    workspace.setSelectedNode(this.node);
    this.editor.focus();

    let curNode = this.node;
    while (!curNode.isRoot) {
      curNode = curNode.parentNode;
      curNode.showFolder();
    }
  }

  deactivate() {
    // console.log("deactivate :>> ", this.doms.root);
    this.doms.root.classList.remove("active");
    this.doms.tabContent.classList.remove("active");
  }

  get isParentDirNameShow() {
    return this.parentDirName !== null;
  }

  get parentDirNameDisplayContent() {
    if (!this.isParentDirNameShow) {
      return "";
    }
    const { root, parent } = this.parentDirName;
    if (parent) {
      return `${root}·${parent}`;
    }
    return root;
  }

  updateParentDirName(root, parent) {
    if (this.isParentDirNameShow) {
      if (parent === this.parentDirName.parent) {
        return;
      }

      this.parentDirName.parent = parent;
      this.doms.parentDirName.textContent = this.parentDirNameDisplayContent;
      return;
    }

    this.parentDirName = { root, parent };

    const div = document.createElement("div");
    div.classList.add("parent-dir-name");
    div.textContent = this.parentDirNameDisplayContent;
    this.doms.parentDirName = div;
    // 插入到root的第一個children後
    this.doms.root.insertBefore(div, this.doms.closeBtn);
  }

  removeParentDirName() {
    if (!this.isParentDirNameShow) {
      return;
    }
    this.parentDirName = null;
    this.doms.parentDirName.remove();
  }

  // save
  async save() {
    const value = this.editor.getValue();
    // console.log("value :>> ", value);
    await this.node.data.save(value);
  }
}

class CodeSpace {
  /** @type {Tab[]} */
  tabs = [];
  /** @type {Tab | null} */
  activeTab = null;

  add({ node, text, file, doms, editorModel, editor }) {
    const tab = new Tab({ node, text, file, doms, editorModel, editor });
    this.tabs.push(tab);

    this.activate(tab);
    this.checkTheSameFilename();
    return tab;
  }

  closeTab(tab) {
    tab.close();

    const idx = this.tabs.indexOf(tab);
    this.tabs.splice(idx, 1);

    if (this.activeTab === tab) {
      this.activeTab = null;
      if (this.tabs.length > 0) this.activate(this.tabs[Math.min(idx, this.tabs.length - 1)]);
    }
  }

  has(node) {
    for (const tab of this.tabs) {
      if (tab.node === node) {
        return true;
      }
    }
    return false;
  }

  get(node) {
    for (const tab of this.tabs) {
      if (tab.node === node) {
        return tab;
      }
    }
    return null;
  }

  activate(tab) {
    // console.log("tabs activate");
    if (this.activeTab) {
      this.activeTab.deactivate();
    }
    this.activeTab = tab;
    tab.activate();
    requestAnimationFrame(() => {
      tab.doms.root.scrollIntoView();
    });
  }

  closeAll() {
    for (const tab of this.tabs) {
      this.closeTab(tab);
    }
  }

  closeOthers(reservedTab) {
    for (const tab of this.tabs) {
      if (tab !== reservedTab) {
        this.closeTab(tab);
      }
    }
  }

  closeToRight(reservedTab) {
    const idx = this.tabs.indexOf(reservedTab);
    for (let i = idx + 1; i < this.tabs.length; i++) {
      this.closeTab(this.tabs[i]);
    }
  }

  closeToLeft(reservedTab) {
    const idx = this.tabs.indexOf(reservedTab);
    for (let i = idx - 1; i >= 0; i--) {
      this.closeTab(this.tabs[i]);
    }
  }

  checkTheSameFilename() {
    let layer = 1;
    const tabs = this.tabs;
    const duplicates = Array.from({ length: tabs.length }, () => false);
    const paths = tabs.map((tab) => tab.node.data.path);
    const names = tabs.map((tab) => tab.node.data.handle.name);

    while (true) {
      const nameCount = names.reduce((acc, name, idx) => {
        acc[name] ||= { count: 0, indexes: [] };
        acc[name].count += 1;
        acc[name].indexes.push(idx);
        return acc;
      }, {});

      let flag;
      for (const name of Object.keys(nameCount)) {
        const { indexes, count } = nameCount[name];
        if (count > 1) {
          flag = true;
          for (const idx of indexes) {
            duplicates[idx] = true;
            const path = paths[idx];
            const nextParentDirNameIdx = path.length - layer - 1;
            const isFirstLayer = layer === 1;

            if (nextParentDirNameIdx === 0) {
              // 下一個父層是root
              if (isFirstLayer) {
                names[idx] = `${path[0]}/${names[idx]}`;
              }
              console.log("idx, names[idx] :>> ", idx, names[idx]);
              continue;
            }

            const parentDirName = path[nextParentDirNameIdx];
            names[idx] = isFirstLayer ? `${path[0]}/${names[idx]}/${parentDirName}` : `${names[idx]}/${parentDirName}`;
            console.log("idx, names[idx] :>> ", idx, names[idx]);
          }
        }
      }
      layer++;
      if (!flag || layer > tabs.length) {
        for (let i = 0; i < duplicates.length; i++) {
          const isDuplicate = duplicates[i];
          if (isDuplicate) {
            const [root, _, ...reversedParent] = names[i].split("/");
            tabs[i].updateParentDirName(root, reversedParent.reverse().join("/"));
          } else {
            tabs[i].removeParentDirName();
          }
        }
        break;
      }
    }
  }

  // save
  saveActiveFile() {
    this.activeTab?.save();
  }
}

const codeSpace = new CodeSpace();
const { openFile } = (() => {
  monaco.editor.defineTheme("myTheme", {
    base: "vs-dark",
    inherit: true,
    rules: [],
    colors: {},
  });
  monaco.editor.setTheme("myTheme");

  const icons = {
    close: `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <title>close</title>
        <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
      </svg>
        `,
  };

  const doms = {
    tabs: document.querySelector(".tabs"),
    codeSpace: document.querySelector(".code-space"),
  };

  /**
   *
   * @param {WorkspaceTreeNode} node
   */
  async function openFile(node) {
    if (codeSpace.has(node)) {
      codeSpace.activate(codeSpace.get(node));
      return;
    }
    // console.log("node :>> ", node);
    const { handle } = node.data;
    if (isDirectoryHandle(handle)) return;

    const file = await handle.getFile();
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = (e) => {
      const result = e.target.result;

      const { tab: tabDom, tabContent, editorContainer, closeBtn } = createTab(file);
      const { editorModel, editor } = createEditor(result, editorContainer, node.data.id);

      const tab = codeSpace.add({
        node,
        text: result,
        file,
        doms: { root: tabDom, tabContent, closeBtn },
        editorModel,
        editor,
      });

      bindTabEvents(tab);
    };
  }

  function createTab(file) {
    const tab = document.createElement("div");
    tab.classList.add("tab");

    const name = document.createElement("div");
    name.classList.add("name");
    name.textContent = file.name;

    const closeBtn = document.createElement("div");
    closeBtn.classList.add("close-btn");
    closeBtn.innerHTML = icons.close;

    tab.appendChild(name);
    tab.appendChild(closeBtn);

    const tabContent = document.createElement("div");
    tabContent.classList.add("tab-content");
    const editorContainer = document.createElement("div");
    editorContainer.style.height = "100%";
    tabContent.appendChild(editorContainer);

    doms.tabs.appendChild(tab);
    doms.codeSpace.appendChild(tabContent);
    return {
      tab,
      tabContent,
      editorContainer,
      closeBtn,
    };
  }

  function createEditor(text, editorContainer, filepath) {
    const editorModel = monaco.editor.createModel(text, undefined, monaco.Uri.file(filepath));
    const editor = monaco.editor.create(editorContainer, {
      // value: this.text,
      // language: undefined,
      model: editorModel,
      automaticLayout: true,
    });

    return {
      editorModel,
      editor,
    };
  }

  /**
   *
   * @param {Tab} tab
   */
  function bindTabEvents(tab) {
    tab.doms.closeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      codeSpace.closeTab(tab);
    });

    tab.doms.root.addEventListener("click", () => {
      codeSpace.activate(tab);
    });
  }

  return {
    openFile,
  };
})();
