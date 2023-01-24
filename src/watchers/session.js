/* eslint-disable no-restricted-globals, prefer-rest-params, no-param-reassign, class-methods-use-this, no-multi-assign */
import { SESSION_NUMBER, SESSION_STARTED } from '../constants';
import { SessionStorageManager, LocalStorageManager } from '../storage-managers';
import Watcher from './watcher';

class SessionWatcher extends Watcher {
  constructor(props) {
    super(props);
  }

  start() {
    let sessionStartTime = SessionStorageManager.get(SESSION_STARTED);
    if (sessionStartTime) {
      if (typeof sessionStartTime === 'string') {
        sessionStartTime = parseInt(sessionStartTime, 10);
      }
    } else {
      sessionStartTime = Date.now();
      SessionStorageManager.set(SESSION_STARTED, sessionStartTime);
      LocalStorageManager.increment(SESSION_NUMBER);
    }

    this.sessionStartTime = sessionStartTime;

    this.emit('change', {
      sessionNumber: parseInt(LocalStorageManager.get(SESSION_NUMBER), 10),
    });
    this.emit('timeChange', { delayForSession: this.sessionStartTime });
  }
}

export default SessionWatcher;
