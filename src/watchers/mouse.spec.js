
import MouseWatcher from './mouse';
import { MOUSE_HISTORY_BUFFER_LEN } from '../constants';

describe('RouteWatcher class', () => {
  let watcher;
  beforeEach(() => {
    watcher = new MouseWatcher();
  });

  describe('checkMovementHistory', () => {
    it('check if latest mouse movements was only up', async () => {
      watcher.moveHistory.push({ pageY: 100, movementY: -5 });
      watcher.moveHistory.push({ pageY: 80, movementY: -4 });
      watcher.moveHistory.push({ pageY: 60, movementY: -3 });
      watcher.moveHistory.push({ pageY: 40, movementY: -2 });
      watcher.moveHistory.push({ pageY: 20, movementY: 0 });
      expect(watcher.checkMovementHistory()).toBe(true);
    });

    it('check if latest mouse movements wasn\'t down', async () => {
      watcher.moveHistory.push({ pageY: 60, movementY: 3 });
      watcher.moveHistory.push({ pageY: 40, movementY: 3 });
      watcher.moveHistory.push({ pageY: 20, movementY: 0 });
      expect(watcher.checkMovementHistory()).toBe(false);
    });

    it('check if latest mouse cooedinated decreasing', async () => {
      watcher.moveHistory.push({ pageY: 30, movementY: 0 });
      watcher.moveHistory.push({ pageY: 40, movementY: 0 });
      watcher.moveHistory.push({ pageY: 50, movementY: 0 });
      expect(watcher.checkMovementHistory()).toBe(false);
    });
  });

  describe('mouseMoveHandler', () => {
    it('pushes events to checkMovementHistory', async () => {
      for (let i = 0; i < MOUSE_HISTORY_BUFFER_LEN * 2; i++) {
        watcher.mouseMoveHandler({
          pageY: 100,
          movementY: 0,
        });
      }
      expect(watcher.moveHistory.length).toBe(MOUSE_HISTORY_BUFFER_LEN);
    });
  });

  describe('mouseEnterHandler', () => {
    it('check if there no from element and entred element is document', async () => {
      const enterListener = jest.fn();
      watcher.on('change', enterListener);
      watcher.mouseEnterHandler({
        fromElement: null,
        target: {
          nodeName: '#document',
        },
      });
      watcher.mouseEnterHandler({
        fromElement: {
          nodeName: '#document',
        },
        target: {
          nodeName: '#document',
        },
      });
      watcher.mouseEnterHandler({
        fromElement: null,
        target: {
          nodeName: 'HTML',
        },
      });
      expect(enterListener).toBeCalledTimes(1);
    });
  });

  describe('mouseLeaveHandler', () => {
    it('check if there no to element and leaved element is html', async () => {
      const leaveListener = jest.fn();
      watcher.mouseMoveHandler({
        pageY: 10,
        movementY: 0,
      });
      watcher.on('change', leaveListener);
      watcher.mouseLeaveHandler({
        toElement: null,
        relatedTarget: {
          nodeName: 'HTML',
        },
      });
      watcher.mouseLeaveHandler({
        toElement: {
          nodeName: 'HTML',
        },
        relatedTarget: {
          nodeName: '#HTML',
        },
      });
      expect(leaveListener).toBeCalledTimes(1);
    });
  });

  describe('reloadActivityTimeout', () => {
    it('drops timeouts and intevals', async () => {
      watcher.windowHasFocus = true;
      watcher.reloadActivityTimeout();
      await new Promise(r => setTimeout(r, 3000));
      watcher.windowHasFocus = false;
      watcher.reloadActivityTimeout();
      await new Promise(r => setTimeout(r, 1000));
      expect(watcher.controlsTimeout).toEqual(undefined);
      expect(watcher.inactivityInterval).toEqual(undefined);
    });

    it('sets interval for inactive user', async () => {
      watcher.windowHasFocus = true;
      watcher.reloadActivityTimeout();
      await new Promise(r => setTimeout(r, 4000));
      expect(watcher.controlsTimeout).toBeGreaterThan(0);
      expect(watcher.inactivityInterval).toBeGreaterThan(0);
    });

    it('emits inactive event', async () => {
      watcher.emit = jest.fn();
      watcher.windowHasFocus = true;
      watcher.reloadActivityTimeout();
      await new Promise(r => setTimeout(r, 3000));
      expect(watcher.emit).toBeCalledTimes(2);
    });
  });
});
