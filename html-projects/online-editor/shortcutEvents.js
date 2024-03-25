(() => {
  const keyDownEvents = [
    // ctrl + s
    {
      condition: (e) => e.ctrlKey && e.code === "KeyS",
      func: (e) => {
        e.preventDefault();
        console.log("儲存");
        return true;
      },
    },
    // {
    //   condition: (e) => e.altKey && e.code === "KeyW",
    //   func: (e) => {
    //     e.preventDefault();
    //     tabs.closeTab(tabs.activeTab);
    //     return true;
    //   },
    // },
  ];

  document.onkeydown = function (e) {
    for (const { condition, func } of keyDownEvents) {
      if (condition(e) && func(e)) {
        codeSpace.saveActiveFile();
        break;
      }
    }
  };
  /**
   * TODO 改成全局
   */
  //   editor.onKeyDown((e) => {
  //     console.log("e :>> ", e);
  //     // ctrl + s
  //     for (const { condition, func } of editorKeyDownEvents) {
  //       if (condition(e) && func(e)) {
  //         const text = editor.getValue();
  //         break;
  //       }
  //     }
  //   });
})();
