class Block {
  /**
   *
   * @param {number[]} layout
   * @param {number} x
   * @param {number} y
   * @param {number} [maxLen]
   */
  constructor(id, layout, x, y, maxLen) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.layout = layout;
    this.maxLen = maxLen || layout.length;
  }

  get idxBlocks() {
    const results = [];
    for (let i = 0; i < this.maxLen; i++) {
      const blocks = [...numberToBinaryStr(this.layout[i], this.maxLen)].reduce((prev, cur, j) => {
        if (castToBool(cur)) {
          prev.push([i, j]);
        }
        return prev;
      }, []);
      results.push(...blocks);
    }
    return results;
  }

  get layoutBinaryStr() {
    return this.layout.map((v) => numberToBinaryStr(v, this.maxLen));
  }

  getRotatedLayout() {
    const idxBlocks = this.idxBlocks;
    const rotatedIdxBlocks = idxBlocks.map((v) => Block.rotate(v, this.maxLen)).sort();
    // console.log("rotatedIdxBlocks :>> ", rotatedIdxBlocks);

    const newLayout = Array.from({ length: this.maxLen }, () => 0);
    rotatedIdxBlocks.forEach((v) => {
      newLayout[v[0]] = newLayout[v[0]] | (1 << (this.maxLen - v[1] - 1));
    });
    // console.log("newLayout :>> ", newLayout);
    return newLayout;
  }

  static getLayoutOccupiedWidth(layout) {
    return Math.max(...layout.map((v) => v.toString(2).length));
  }

  static rotate([i, j], len) {
    return [len - j - 1, i];
  }
}

// doms
const doms = (() => {
  const lists = [...document.querySelectorAll(".playground .row")];
  const items = lists.map((v) => [...v.children]);
  return {
    lists,
    items,
    pendingItems: [...document.querySelectorAll(".pending-list .row")].map((v) => v.children),
    storingItems: [...document.querySelectorAll(".storing-list .row")].map((v) => v.children),
  };
})();

// 寬高
const rowNum = doms.lists.length;
const colNum = doms.items[0].length;

// 準備所有的方塊
const ALL_BLOCKS = {
  L: () => new Block("L", [0b10, 0b10, 0b11], colNum / 2 - 2, 0),
  J: () => new Block("J", [0b01, 0b01, 0b11], colNum / 2 - 2, 0),
  "|": () => new Block("|", [0b01, 0b01, 0b01, 0b01], colNum / 2 - 2, 0, 4),
  O: () => new Block("O", [0b11, 0b11], colNum / 2 - 1, 0),
  T: () => new Block("T", [0b10, 0b11, 0b10], colNum / 2 - 2, 0),
  5: () => new Block("5", [0b01, 0b11, 0b10], colNum / 2 - 2, 0),
  S: () => new Block("S", [0b10, 0b11, 0b01], colNum / 2 - 2, 0),
};
const ALL_BLOCK_STR = Object.keys(ALL_BLOCKS);

const LEFT_BOUNDARY = Number(`0b${"1".padEnd(colNum, "0")}`);
const RIGHT_BOUNDARY = Number(`0b${"1".padStart(colNum, "0")}`);
const FILLED_NUM = Number(`0b${"1".padStart(colNum, "1")}`);

const sceneBlocks = Array.from({ length: rowNum }, () => 0);
// const sceneBlocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0b1111011111, 0b1111101111];
let movingBlocks = Array.from({ length: rowNum }, () => 0);

/** @type {Block[]} */
const pendingBlocks = [];
const MAX_PENDING_COUNT = 5;

let isMoving = false;
// let isPause = false;
/** @type {Block} */
let curBlock = null;
/** @type {Block | null} */
let storingBlock = null;
let storable = true;

/**
 *
 * @param {Block} block
 */
function getMergedMovingBlocks(layout, startX, startY, layoutMaxLen) {
  const copiedMovingBlocks = [...movingBlocks];
  layout.forEach((v, i) => {
    // 將v往左移動 總長度 - 開始的x - layout最大長度
    const leftOffset = colNum - Math.max(startX, 0) - layoutMaxLen;
    copiedMovingBlocks[i + startY] = v << leftOffset;
  });
  return copiedMovingBlocks;
}

function addPendingBlock() {
  if (pendingBlocks.length >= MAX_PENDING_COUNT) {
    return;
  }
  const randomNum = Math.floor(Math.random() * ALL_BLOCK_STR.length);
  pendingBlocks.push(ALL_BLOCKS[ALL_BLOCK_STR[randomNum]]());
  renderPendingBlocks();
}

function addPendingBlocks() {
  for (let i = 0; i < MAX_PENDING_COUNT; i++) {
    addPendingBlock();
  }
}

function addBlock() {
  curBlock = pendingBlocks.shift();
  addPendingBlock();
  movingBlocks = getMergedMovingBlocks(curBlock.layout, curBlock.x, curBlock.y, curBlock.maxLen);
  isMoving = true;
}

const isLineConflict = {
  /**
   * from 的第i行是否有碰到conflictTarget的最上方
   * @param {*} i
   * @param {*} from
   * @param {*} conflictTarget
   * @returns
   */
  top(i, from, conflictTarget) {
    return (from[i] & conflictTarget[i + 1]) !== 0;
  },

  left(i, from, conflictTarget) {
    return ((from[i] << 1) & conflictTarget[i]) !== 0;
  },

  right(i, from, conflictTarget) {
    return ((from[i] >>> 1) & conflictTarget[i]) !== 0;
  },
};

const isBoundaryReached = {
  bottom(_movingBlocks = movingBlocks) {
    return _movingBlocks[_movingBlocks.length - 1] !== 0;
  },
  left(_movingBlocks = movingBlocks) {
    return findIdxMovingLines(_movingBlocks).some((i) => {
      return (_movingBlocks[i] & LEFT_BOUNDARY) !== 0;
    });
  },
  right(_movingBlocks = movingBlocks) {
    return findIdxMovingLines(_movingBlocks).some((i) => {
      return (_movingBlocks[i] & RIGHT_BOUNDARY) !== 0;
    });
  },

  top(_movingBlocks = movingBlocks) {
    return _movingBlocks[0] !== 0;
  },
};

const isMovingBlocksReachedScene = {
  top(_movingBlocks = movingBlocks) {
    return findIdxMovingLines(_movingBlocks).some((i) => {
      return isLineConflict.top(i, _movingBlocks, sceneBlocks);
    });
  },

  left(_movingBlocks = movingBlocks) {
    return findIdxMovingLines(_movingBlocks).some((i) => {
      return isLineConflict.left(i, _movingBlocks, sceneBlocks);
    });
  },

  right(_movingBlocks = movingBlocks) {
    return findIdxMovingLines(_movingBlocks).some((i) => {
      return isLineConflict.right(i, _movingBlocks, sceneBlocks);
    });
  },

  any(_movingBlocks = movingBlocks) {
    return findIdxMovingLines(_movingBlocks).some((i) => {
      return (
        isLineConflict.top(i, _movingBlocks, sceneBlocks) ||
        isLineConflict.left(i, _movingBlocks, sceneBlocks) ||
        isLineConflict.right(i, _movingBlocks, sceneBlocks)
      );
    });
  },
};

function findIdxMovingLines(_movingBlocks = movingBlocks) {
  const indexes = [];
  for (let i = 0; i < _movingBlocks.length; i++) {
    if (_movingBlocks[i] !== 0) {
      indexes.push(i);
    }
  }
  return indexes;
}

function findIdxMovingBlocks(_movingBlocks = movingBlocks) {
  const indexes = findIdxMovingLines(_movingBlocks);
  const results = [];
  for (const i of indexes) {
    const curLineActiveIndexes = [...numberToBinaryStr(_movingBlocks[i], colNum)].reduce((prev, cur, j) => {
      if (castToBool(cur)) {
        prev.push([i, j]);
      }
      return prev;
    }, []);
    results.push(...curLineActiveIndexes);
  }
  return results;
}

function findIdxFilledLines() {
  const indexes = [];
  for (let i = 0; i < sceneBlocks.length; i++) {
    // console.log("sceneBlocks[i], i :>> ", sceneBlocks[i], i);
    if (sceneBlocks[i] === FILLED_NUM) {
      indexes.push(i);
    }
  }
  // console.log("🚀 ~ findIdxFilledLines ~ indexes:", indexes);

  return indexes;
}

function findIdxFilledBlocks() {
  const indexes = findIdxFilledLines();
  const results = [];
  for (const i of indexes) {
    results.push(...Array.from({ length: colNum }).map((_, k) => [i, k]));
  }
  return results;
}

function removeSceneLines(linesIndexes) {
  // console.log("sceneBlocks1 :>> ", 。JSON.parse(JSON.stringify(sceneBlocks)));
  for (const i of linesIndexes.sort((a, b) => a - b)) {
    // console.log("i :>> ", i);。
    sceneBlocks.splice(i, 1);
    // console.log("sceneBlocks2 。:>> ", JSON.parse(JSON.stringify(sceneBlocks)));
    sceneBlocks.unshift(0);
    // console.log("sceneBlocks3 。:>> ", JSON.parse(JSON.stringify(sceneBlocks)));
  }
}

function clearMovingBlocks() {
  for (let i = 0; i < movingBlocks.length; i++) {
    movingBlocks[i] = 0;
  }
}

function joinToScene() {
  const ANIM_FLASH_INTERVAL = 100;
  return new Promise((res, rej) => {
    const movingLineIndexes = findIdxMovingLines();
    for (const idx of movingLineIndexes) {
      sceneBlocks[idx] |= movingBlocks[idx];
    }

    const filledLineIndexes = findIdxFilledLines();
    // console.log("filledLineIndexes :>> ", filledLineIndexes);
    if (filledLineIndexes.length) {
      // 有行被填滿
      const blocksIndexes = findIdxFilledBlocks();
      for (const [i, j] of blocksIndexes) {
        doms.items[i][j].classList.add("filled");
      }

      // 動畫閃爍三次
      let animCount = 1;
      const MAX_ANIM_COUNT = 3;
      const timerId = setInterval(() => {
        if (animCount > MAX_ANIM_COUNT) {
          removeSceneLines(filledLineIndexes);
          res(true);
          return clearInterval(timerId);
        }
        for (const [i, j] of blocksIndexes) {
          doms.items[i][j].classList.toggle("filled");
        }
        animCount++;
      }, ANIM_FLASH_INTERVAL);
    } else {
      // 沒有行被填滿
      const indexes = findIdxMovingBlocks();
      for (const [i, j] of indexes) {
        doms.items[i][j].classList.add("filled");
      }

      setTimeout(() => {
        for (const [i, j] of indexes) {
          doms.items[i][j].classList.remove("filled");
        }
        res(true);
      }, ANIM_FLASH_INTERVAL);
    }

    clearMovingBlocks();
    storable = true;
  });
}

function getBlocksMovedDownOneLine(blocks) {
  return [0].concat(blocks.slice(0, -1));
}

// 操作
/**
 *
 * @returns {boolean} true: 最後一行
 */
function moveDown() {
  if (!isMoving) return true;
  if (isBoundaryReached.bottom() || isMovingBlocksReachedScene.top()) {
    isMoving = false;
    console.log("最後一行啦");

    if (isBoundaryReached.top()) {
      pauseGame();
    } else {
      joinToScene().then(addBlock);
    }

    return true;
  }
  movingBlocks = getBlocksMovedDownOneLine(movingBlocks);
  curBlock.y++;
  return false;
}

function moveToBottom() {
  while (!moveDown()) {
    // do nothing
  }
}

function moveLeft() {
  if (!isMoving) return;
  if (isBoundaryReached.left() || isMovingBlocksReachedScene.left()) return;
  for (let i = 0; i < movingBlocks.length; i++) {
    if (movingBlocks[i] !== 0) {
      movingBlocks[i] <<= 1;
    }
  }
  curBlock.x--;
}

function moveRight() {
  if (!isMoving) return;
  if (isBoundaryReached.right() || isMovingBlocksReachedScene.right()) return;
  for (let i = 0; i < movingBlocks.length; i++) {
    if (movingBlocks[i] !== 0) {
      movingBlocks[i] >>>= 1;
    }
  }
  curBlock.x++;
}

function rotate() {
  if (!isMoving) return;
  const newLayout = curBlock.getRotatedLayout();
  // console.log("newLayout :>> ", newLayout);

  // 如果旋轉過後的寬度超過最大寬度，就不要旋轉了
  if (Block.getLayoutOccupiedWidth(newLayout) + curBlock.x > colNum) return;
  // curBlock.layout = newLayout;
  const mergedMovingBlocks = getMergedMovingBlocks(newLayout, curBlock.x, curBlock.y, curBlock.maxLen);

  // 如果旋轉過後有與任何場景區塊重疊，就不要旋轉了
  if (isMovingBlocksReachedScene.any(mergedMovingBlocks)) return;
  curBlock.layout = newLayout;
  movingBlocks = mergedMovingBlocks;
}

function storeBlock() {
  if (!storable) return;
  storable = false;
  if (!storingBlock) {
    storingBlock = ALL_BLOCKS[curBlock.id]();
  } else {
    pendingBlocks.unshift(storingBlock);
    storingBlock = ALL_BLOCKS[curBlock.id]();
  }
  renderStoringBlock();

  clearMovingBlocks();
  addBlock();
}

// render

function setActiveStateByBlock(el, block) {
  if (castToBool(block)) {
    el.classList.add("active");
  } else {
    el.classList.remove("active");
  }
}

function renderPreviewBlocks() {
  let copiedMovingBlocks = [...movingBlocks];
  while (!(isBoundaryReached.bottom(copiedMovingBlocks) || isMovingBlocksReachedScene.top(copiedMovingBlocks))) {
    copiedMovingBlocks = getBlocksMovedDownOneLine(copiedMovingBlocks);
  }
  const indexes = findIdxMovingBlocks(copiedMovingBlocks);
  for (const [i, j] of indexes) {
    doms.items[i][j].classList.add("preview");
  }
}

function renderPendingBlocks() {
  if (!pendingBlocks.length || !doms.pendingItems.length) {
    return;
  }

  let h = 0;
  const PENDING_BLOCK_REGION_WIDTH = 2;
  for (const block of pendingBlocks) {
    for (const row of block.layout.map((v) => numberToBinaryStr(v, PENDING_BLOCK_REGION_WIDTH))) {
      for (let i = 0; i < PENDING_BLOCK_REGION_WIDTH; i++) {
        setActiveStateByBlock(doms.pendingItems[h][i], row[i]);
      }

      h += 1;
      if (h >= rowNum) {
        return;
      }
    }

    for (let i = 0; i < PENDING_BLOCK_REGION_WIDTH; i++) {
      doms.pendingItems[h][i].classList.remove("active");
    }

    h += 1;
    if (h >= rowNum) {
      return;
    }
  }
}

function renderStoringBlock() {
  if (!storingBlock) return;
  const STORING_BLOCKS_REGION_WIDTH = 2;
  const STORING_BLOCKS_REGION_HEIGHT = 4;
  const layout = storingBlock.layout.map((v) => numberToBinaryStr(v, STORING_BLOCKS_REGION_WIDTH));
  for (let i = 0; i < STORING_BLOCKS_REGION_HEIGHT; i++) {
    for (let j = 0; j < STORING_BLOCKS_REGION_WIDTH; j++) {
      if (layout.length <= i || layout[i].length <= j) {
        doms.storingItems[i][j].classList.remove("active");
        continue;
      }
      setActiveStateByBlock(doms.storingItems[i][j], layout[i][j]);
    }
  }
}

function render() {
  for (let i = 0; i < rowNum; i++) {
    const blocks = numberToBinaryStr(sceneBlocks[i] | movingBlocks[i], colNum);
    for (let j = 0; j < blocks.length; j++) {
      setActiveStateByBlock(doms.items[i][j], blocks[j]);
      doms.items[i][j].classList.remove("preview");
    }
  }

  if (isMoving) {
    renderPreviewBlocks();
  }
  requestAnimationFrame(render);
}

function bindEvent() {
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowLeft":
        // console.log("moveLeft");
        moveLeft();
        break;
      case "ArrowRight":
        // console.log("moveRight");
        moveRight();
        break;
      case "ArrowDown":
        // console.log("moveDown");
        moveDown();
        break;
      case " ":
        // console.log("moveToBottom");
        moveToBottom();
        break;
      case "ArrowUp":
        // console.log("rotate");
        rotate();
        break;
      case "c":
        // console.log("storeBlock");
        storeBlock();
      default:
        break;
    }
  });
}

let moveDownInterval = 1000,
  moveDownTimer = null;

function pauseGame() {
  moveDownTimer && clearInterval(moveDownTimer);
  isMoving = false;
}

function init() {
  addPendingBlocks();
  bindEvent();
  addBlock();
  render();
  moveDownTimer = setInterval(() => {
    moveDown();
  }, moveDownInterval);
}

init();
