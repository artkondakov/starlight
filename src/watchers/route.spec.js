
import { SessionStorageManager } from '../storage-managers';
import { PAGES_AT_SESSION } from '../constants';
import RouteWatcher from './route';

describe('RouteWatcher class', () => {
  let watcher;
  beforeEach(() => {
    SessionStorageManager.set(PAGES_AT_SESSION, 0);
    watcher = new RouteWatcher();
  });

  it('creates history listener at start', async () => {
    watcher.createHistoryEventsDispatcher = jest.fn();
    watcher.start();
    expect(watcher.createHistoryEventsDispatcher).toHaveBeenCalled();
  });

  it('can handle history state changed', async () => {
    const callback = jest.fn();
    watcher.on('change', callback);
    watcher.start();
    expect(callback).toHaveBeenCalledWith({ urls: '/', excludeUrls: '/', pageNumber: 1, scroll: 0 });
    window.history.pushState({ page: 1 }, 'foo', '/?page=1');
    expect(callback).toHaveBeenCalledWith({ urls: '/', excludeUrls: '/', pageNumber: 2, delayForPage: 0 });
  });

  it('calculates page height left', async () => {
    global.window.pageYOffset = 100;
    const callback = jest.fn();
    watcher.on('change', callback);
    watcher.bodyHeight = 1000;
    watcher.scrollHandler();
    expect(callback).toHaveBeenCalledWith({ scroll: 10 });
  });
});
