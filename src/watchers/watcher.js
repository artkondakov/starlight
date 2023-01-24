class Watcher {
  constructor() {
    this.$events = [];
    this.initialData = {};
  }

  start() {
    console.log(`Starting ${this.constructor.name}...`);
  }

  stop() {
    console.log(`Stop ${this.constructor.name}`);
  }

  on(eventName, callback) {
    this.$events.push({eventName, callback});
  }

  emit(eventName, ...args) {
    const event = this.$events.find(e => e.eventName === eventName);
    if (event) {
      event.callback(...args);
    }
  }
}

export default Watcher;
