(() => {
  const doms = {
    container: document.querySelector(".container"),
    leftSide: document.querySelector(".left-side"),
    rightSide: document.querySelector(".right-side"),
  };

  function setLeftSideWidth(width) {
    // doms.leftSide.setAttribute("--width", `${width}px`);
    // doms.rightSide.setAttribute("--width", `calc(100% - ${width}px)`);
    doms.container.setAttribute("style", `--left-side-width:${width}px`);
  }

  setLeftSideWidth(250);
})();
