class EventEmitter {
  constructor() {
    this._events = {};
  }
  on(event, listener) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(listener);
  }
  emit(event, ...args) {
    if (!this._events[event]) {
      return;
    }
    this._events[event].forEach((listener) => {
      listener(...args);
    });
  }
}
