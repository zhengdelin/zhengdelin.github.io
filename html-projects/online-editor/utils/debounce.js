function debounce(fn, { delay = 1000, immediately = false } = {}) {
  let timer = null;
  if (immediately) {
    return function (...args) {
      const isFirstClick = !timer;
      clearTimeout(timer);
      if (isFirstClick) fn.apply(this, args);

      timer = setTimeout(() => {
        timer = null;
      }, delay);
    };
  }

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log("run");
      fn.apply(this, args);
    }, delay);
  };
}
