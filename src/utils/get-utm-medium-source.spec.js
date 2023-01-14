import getUTMMediumSource from './get-utm-medium-source';

describe('getUTMMediumSource', () => {
  it ('should return string with source if param passed', () => {
    expect(getUTMMediumSource('vk.com')).toBe('vk');
  });

  it ('should return undefined with source if param doesnt exist', () => {
    expect(typeof getUTMMediumSource('masonry')).toBe('undefined');
  });

  it ('should return undefined if no param passed', () => {
    expect(typeof getUTMMediumSource()).toBe('undefined');
  });
});