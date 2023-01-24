
import SessionWatcher from './session';
import { SESSION_STARTED, SESSION_NUMBER } from '../constants';
import { SessionStorageManager, LocalStorageManager } from '../storage-managers';

describe('SessionWatcher class', () => {
  let watcher;
  beforeEach(() => {
    watcher = new SessionWatcher();
  });

  it('emits session start time and session number', async () => {
    const startTime = Date.now();
    SessionStorageManager.set(SESSION_STARTED, startTime);
    LocalStorageManager.set(SESSION_NUMBER, 10);
    const changeHandler = jest.fn();
    const timeHandler = jest.fn();
    watcher.on('change', changeHandler);
    watcher.on('timeChange', timeHandler);
    watcher.start();
    expect(changeHandler).toBeCalledWith({ sessionNumber: 10 });
    expect(timeHandler).toBeCalledWith({ delayForSession: startTime });
  });
});
