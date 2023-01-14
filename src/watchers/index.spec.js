/* eslint-disable camelcase, @typescript-eslint/camelcase, no-new */
import RulesWatcher from './index';
import { UTM_SOURCE_QUERY_PARAM, UTM_MEDIUM_QUERY_PARAM } from '../constants';

const mockRules = {
  and: [
    {
      '>=': [
        {
          var: 'scroll',
        },
        50,
      ],
    },
    {
      '>=': [
        {
          var: 'delayForSession',
        },
        2,
      ],
    },
    {
      '>=': [
        {
          var: 'delayForPage',
        },
        2,
      ],
    },
    {
      '>=': [
        {
          var: 'pageNumber',
        },
        1,
      ],
    },
    {
      UrlRegExp: [
        {
          var: 'urls',
        },
        '/new',
      ],
    },
    {
      NotUrlRegExp: [
        {
          var: 'excludeUrls',
        },
        '/fashion/',
      ],
    },
    {
      '==': [
        {
          var: 'subscribed',
        },
        false,
      ],
    },
    {
      '==': [
        {
          var: 'source',
        },
        'facebook',
      ],
    },
  ],
};

global.window.consentData = {
  getConfig: jest.fn(),
  getUserInfo: jest.fn(() => ({
    userAgree: { default: true },
    is_fraud: false,
    is_eu: true,
    is_bot: false,
  })),
};
global.window.pageYOffset = 500;
const searchString = `?${UTM_SOURCE_QUERY_PARAM}=facebook&${UTM_MEDIUM_QUERY_PARAM}=vk`;
Object.defineProperty(window, 'location', {
  value: {
    href: `http://any.random.site/${searchString}`,
    search: searchString, 
  }
});
jest.spyOn(document.documentElement, 'scrollHeight', 'get').mockImplementation(() => 700);

describe('RulesWatcher', () => {
  it('accepts rules and callback', async () => {
    const rules = mockRules;
    const callback = jest.fn();
    new RulesWatcher(callback);
    await new Promise((r) => setTimeout(r, 2000));
    const { calls } = callback.mock;
    const [callbackParams] = calls[calls.length - 1];
    expect(callbackParams.urls).toBe('/');
    expect(callbackParams.excludeUrls).toBe('/');
    expect(callbackParams.source).toBe('vk');
    expect(callbackParams.scroll).toBe(0);
    expect(callbackParams.delayForPage).toBeGreaterThanOrEqual(1);
    expect(callbackParams.delayForSession).toBeGreaterThanOrEqual(1);
    expect(callbackParams.pageNumber).toBe(1);
    expect(callbackParams.timeoutAfterAgreeConsent).toBeGreaterThanOrEqual(1);
    expect(callbackParams.consentAgreed).toBe(true);
  });
});
