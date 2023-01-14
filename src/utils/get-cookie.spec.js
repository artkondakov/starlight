import getCookie from './get-cookie';

describe('Get cookie cookies string', () => {
  it('should return cookie value if cookie exist', () => {
    const mockCookieString = 'c1=123; c2=456; c3=789;';

    expect(getCookie(mockCookieString, 'c1')).toBe('123');
  });

  it('should return undefined if cookie does not exist', () => {
    const mockCookieString = 'c1=123; c2=456; c3=789;';

    expect(typeof getCookie(mockCookieString, 'c4')).toBe('undefined');
  });
});
