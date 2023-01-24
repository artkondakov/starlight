import Watcher from './watcher';

describe('Watcher class', () => {
  let watcher;
  beforeEach(() => {
    watcher = new Watcher();
  });

  it('can accept event listeners', async () => {
    console.log = jest.fn();
    watcher.start();
    expect(console.log.mock.calls[0][0]).toBe('Starting Watcher...');
    watcher.stop();
    expect(console.log.mock.calls[1][0]).toBe('Stop Watcher');
  });

  it('can accept event listeners', async () => {
    // eslint-disable-next-line
    watcher.on('foo', () => {});
    expect(watcher.$events.length).toEqual(1);
  });

  it('can trigger callback on event', async () => {
    const callback = jest.fn();
    watcher.on('foo', callback);
    watcher.emit('foo', 'bar');
    expect(callback).toHaveBeenLastCalledWith('bar');
  });
});
