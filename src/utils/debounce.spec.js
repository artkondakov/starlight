import debounce from './debounce';

describe('Debounce', () => {
  it('allow call fn not to call too often', async () => {
    const cb = jest.fn();
    const debounced = debounce(cb, 100);
    for (let i = 0; i < 3; i += 1) {
      setTimeout(debounced, i * 50);
    }
    await new Promise(r => setTimeout(r, 300));
    expect(cb).toHaveBeenCalledTimes(1);
  });
});