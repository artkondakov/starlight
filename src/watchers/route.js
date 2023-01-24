/* eslint-disable no-restricted-globals, prefer-rest-params, no-param-reassign, class-methods-use-this, no-multi-assign */
import { PAGES_AT_SESSION } from '../constants';
import { SessionStorageManager } from '../storage-managers';
import Watcher from './watcher';
import throttle from '../utils/throttle';

class RouteWatcher extends Watcher {
  constructor(props) {
    super(props);

    this.stateWatcher = this.stateWatcher.bind(this);
    this.scrollHandler = this.scrollHandler.bind(this);
  }

  start() {
    this.createHistoryEventsDispatcher(window.history);
    window.onpopstate = history.onpushstate = this.stateWatcher;
    let pagesAtSession = parseInt(SessionStorageManager.get(PAGES_AT_SESSION), 10);
    if (pagesAtSession) {
      pagesAtSession = SessionStorageManager.increment(PAGES_AT_SESSION);
    } else {
      pagesAtSession = 1;
      SessionStorageManager.set(PAGES_AT_SESSION, pagesAtSession);
    }
    const { href } = window.location;
    const { pathname } = new URL(href);
    
    this.windowHeight = window.innerHeight;
    this.bodyHeight = document.body.offsetHeight || 1;
    window.addEventListener('scroll', throttle(this.scrollHandler, 750));

    const initialRouteData = { urls: pathname, excludeUrls: pathname, pageNumber: pagesAtSession, scroll: 0 };
    this.emit('change', initialRouteData);
    this.emit('timeChange', { delayForPage: Date.now() });

    return initialRouteData;
  }

  stateWatcher() {
    const historyLength = SessionStorageManager.increment(PAGES_AT_SESSION);
    const { href } = window.location;

    this.bodyHeight = document.body.offsetHeight || 1;
    this.currScrollPos = window.pageYOffset;
    const { pathname } = new URL(href);
    this.currentPageStartTime = Date.now();

    this.emit('change', { urls: pathname, excludeUrls: pathname, pageNumber: historyLength, delayForPage: 0 });
    this.emit('timeChange', { delayForPage: this.currentPageStartTime });
  }

  createHistoryEventsDispatcher(history) {
    const { pushState } = history;
    history.pushState = function(state) {
      const pushed = pushState.apply(history, arguments);
      if (typeof history.onpushstate === 'function') {
        history.onpushstate({ state });
      }
      return pushed;
    };
  }

  scrollHandler() {
    this.currScrollPos = window.pageYOffset;
    let percentsLeft = Math.round(((this.bodyHeight - this.currScrollPos) / this.bodyHeight) * 100);
    if (percentsLeft < 0) {
      percentsLeft = 100;
    }
    this.emit('change', { scroll: 100 - percentsLeft });
  }
}

export default RouteWatcher;
