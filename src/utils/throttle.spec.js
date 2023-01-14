import throttle from './throttle';

describe('Throttle', () => {
  it('allow call fn not to call too often', async () => {
    const cb = jest.fn();
    const throttled = throttle(cb, 100);
    for (let i = 0; i < 4; i += 1) {
      setTimeout(throttled, i * 50);
    }
    await new Promise(r => setTimeout(r, 220));
    expect(cb).toHaveBeenCalledTimes(2);
  });
});