/* eslint-disable no-restricted-globals, prefer-rest-params, no-param-reassign, class-methods-use-this, no-multi-assign */
import { MOUSE_HISTORY_BUFFER_LEN, MOUSE_INACTIVE_TIMEOUT, TICK_INTERVAL } from '../constants';
import Watcher from './watcher';
import { throttle } from '../utils';

class MouseWatcher extends Watcher {
  constructor(props) {
    super(props);
    this.moveHistory = [];
    this.windowHasFocus = null;
    this.controlsTimeout = null;
    this.inactivityInterval = null;
    this.inactivityTime = 0;
    this.checkMovstartementHistory = this.start.bind(this);
    this.checkMovementHistory = this.checkMovementHistory.bind(this);
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
    this.mouseEnterHandler = this.mouseEnterHandler.bind(this);
    this.mouseLeaveHandler = this.mouseLeaveHandler.bind(this);
    this.windowBlured = this.windowBlured.bind(this);
    this.windowFocused = this.windowFocused.bind(this);
    this.windowFocusChanged = this.windowFocusChanged.bind(this);
    this.keyPressed = this.keyPressed.bind(this);
    this.reloadActivityTimeout = this.reloadActivityTimeout.bind(this);
    this.throttledReloadActivityTimeout = throttle(this.reloadActivityTimeout, 300).bind(this);
  }

  start() {
    document.addEventListener('mousemove', this.mouseMoveHandler);
    document.addEventListener('mouseenter', this.mouseEnterHandler);
    document.addEventListener('mouseleave', this.mouseLeaveHandler);
    document.addEventListener('wheel', this.keyPressed);
    window.addEventListener('blur', this.windowBlured);
    window.addEventListener('focus', this.windowFocused);
    document.addEventListener('keypress', this.keyPressed);
    this.windowHasFocus = document.hasFocus();
    this.windowFocusChanged(null, this.windowHasFocus);
    this.reloadActivityTimeout();
  }

  stop() {
    document.removeEventListener('mousemove', this.mouseMoveHandler);
    document.removeEventListener('mouseenter', this.mouseEnterHandler);
    document.removeEventListener('mouseleave', this.mouseLeaveHandler);
    document.removeEventListener('wheel', this.keyPressed);
    window.removeEventListener('blur', this.windowBlured);
    window.removeEventListener('focus', this.windowFocused);
    document.removeEventListener('keypress', this.keyPressed);
  }

  checkMovementHistory() {
    // remove all movements until upcoming
    // check left movements
    let historyValid = true;
    if (this.moveHistory.length > 1) {
      for (let i = 1; i < this.moveHistory.length; i++) {
        historyValid = historyValid && this.moveHistory[i].pageY <= this.moveHistory[i - 1].pageY && this.moveHistory[i].movementY <= 0;
      }
    }
    historyValid = historyValid && this.moveHistory[this.moveHistory.length - 1].pageY < 100 && this.moveHistory[this.moveHistory.length - 1].movementY <= 0;
    return historyValid;
  }

  mouseMoveHandler(e) {
    const { pageY, clientY, movementY } = e;
    const { pageYOffset } = window;
    const eventData = { pageY: pageY - pageYOffset, movementY };
    this.moveHistory.push(eventData);
    if (this.moveHistory.length > MOUSE_HISTORY_BUFFER_LEN) {
      this.moveHistory.shift();
    }
    this.throttledReloadActivityTimeout();
  }

  mouseEnterHandler(e) {
    const { fromElement, target} = e;
    if (!fromElement && target?.nodeName === '#document') {
      this.emit('change', { goingToCloseWindow: false });
    }
  }

  mouseLeaveHandler(e) {
    let from = e.relatedTarget || e.toElement;
      if (!from || from.nodeName === 'HTML') {
        const movingUp = this.checkMovementHistory();
        movingUp && this.emit('change', { goingToCloseWindow: true });
      }
  }

  windowBlured(e) {
    this.windowHasFocus = false;
    this.windowFocusChanged(e, this.windowHasFocus);
  }

  windowFocused(e) {
    this.windowHasFocus = true;
    this.windowFocusChanged(e, this.windowHasFocus);
  }

  windowFocusChanged(e, isFocused) {
    this.emit('change', { windowHasFocus: isFocused });
  }

  keyPressed() {
    this.throttledReloadActivityTimeout();
  }

  reloadActivityTimeout() {
    if (this.controlsTimeout) this.controlsTimeout = clearTimeout(this.controlsTimeout);
    if (this.inactivityInterval) this.inactivityInterval = clearInterval(this.inactivityInterval);
    this.inactivityTime = 0;
    this.emit('change', { userIsInactiveFor: this.inactivityTime });
    if (this.windowHasFocus) {
      this.controlsTimeout = setTimeout(() => {
        this.inactivityTime += Math.round(MOUSE_INACTIVE_TIMEOUT / 1000);
        this.inactivityInterval = setInterval(() => {
          this.inactivityTime++;
          this.emit('change', { userIsInactiveFor: this.inactivityTime });
        }, TICK_INTERVAL);
      }, MOUSE_INACTIVE_TIMEOUT);
    }
  }
}

export default MouseWatcher;
