/* eslint-disable no-useless-escape */
import CookieManager from './cookie-manager';

describe('CookieManager', () => {
  it('should return cookie value if cookie exist', () => {
    jest.spyOn(document, 'cookie', 'get').mockImplementation(() => 'c1=123; c2=456; c3=789');
    expect(CookieManager.get('c1')).toEqual('123');
  });

  it('should return undefined if cookie does not exist', () => {
    jest.spyOn(document, 'cookie', 'get').mockImplementation(() => 'c1=123; c2=456; c3=789');
    expect(typeof CookieManager.get('c4')).toEqual('undefined');
  });

  it('should throw an error if tries to increment', () => {
    try {
      CookieManager.increment('c4')
    } catch(e) {
      expect(e.toString()).toEqual('Error: Do not use \"increment\" method with cookies');
    }
  });

  it('can set cookie', () => {
    let mockCookies = 'c1=123; c2=456; c3=789'
    jest.spyOn(document, 'cookie', 'get').mockImplementation(() => mockCookies);
    jest.spyOn(document, 'cookie', 'set').mockImplementation((newCookie) => {
      mockCookies += `; ${newCookie}`;
    });
    CookieManager.set('c4', '000');
    expect(CookieManager.get('c4')).toEqual('000');
  });

  it('can set cookie with options', () => {
    let mockCookies = ''
    jest.spyOn(document, 'cookie', 'get').mockImplementation(() => mockCookies);
    jest.spyOn(document, 'cookie', 'set').mockImplementation((newCookie) => {
      mockCookies = newCookie;
    });
    CookieManager.set('c4', '000', { expires: 100, path: '/slug/' });
    expect(document.cookie.indexOf('expires') >= 0).toBe(true);
    expect(document.cookie.indexOf('slug') >= 0).toBe(true);
  });
});
