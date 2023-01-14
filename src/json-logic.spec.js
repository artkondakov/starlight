import jsonLogic, { makeRegExpString, makeCodeString } from './json-logic';

describe('jsonLogic extension', () => {
  describe('makeRegExpString', () => {
    it('creates regexp string', async () => {
      const source = 'new';
      expect(makeRegExpString(source)).toBe('/^new/gi');
    });

    it('escape slashes', async () => {
      const source = '/new/';
      expect(makeRegExpString(source)).toBe('/^\\/new\\//gi');
    });

    it("converts asterisks to 'any' symbol", async () => {
      const source = '/new/*';
      expect(makeRegExpString(source)).toBe('/^\\/new\\/.+/gi');
    });
  });

  describe('makeCodeString', () => {
    it('returns string with creating Regexp and .test method', async () => {
      const sourceRegexp = '/new/*';
      const sourceUrl = '/new';
      expect(makeCodeString(sourceRegexp, sourceUrl)).toBe(
        "(new RegExp(/^\\/new\\/.+/gi).test('/new'))",
      );
    });
  });

  describe('applying jsonLogic', () => {
    it('show always if regexp is *', () => {
      const mockRules = {
        and: [
          {
            UrlRegExp: [
              {
                var: 'urls',
              },
              '*',
            ],
          },
        ],
      };
      expect(jsonLogic.apply(mockRules, {
        urls: '/',
      })).toBe(true);
      expect(jsonLogic.apply(mockRules, {
        urls: '/tag',
      })).toBe(true);
      expect(jsonLogic.apply(mockRules, {
        urls: '/tag/article',
      })).toBe(true);
    });

    it('show at home if regexp is /', () => {
      const mockRules = {
        and: [
          {
            UrlRegExp: [
              {
                var: 'urls',
              },
              '/',
            ],
          },
        ],
      };
      expect(jsonLogic.apply(mockRules, {
        urls: '/',
      })).toBe(true);
      expect(jsonLogic.apply(mockRules, {
        urls: '/tag',
      })).toBe(false);
    });


    it('show at tag page if regexp is /fashion', () => {
      const mockRules = {
        and: [
          {
            UrlRegExp: [
              {
                var: 'urls',
              },
              '/fashion',
            ],
          },
        ],
      };
      expect(jsonLogic.apply(mockRules, {
        urls: '/fashion'
      })).toBe(true);
      expect(jsonLogic.apply(mockRules, {
        urls: '/notfashion'
      })).toBe(false);
      expect(jsonLogic.apply(mockRules, {
        urls: '/'
      })).toBe(false);
    });

    it('show at article page if regexp is /fashion/article', () => {
      const mockRules = {
        and: [
          {
            UrlRegExp: [
              {
                var: 'urls',
              },
              '/fashion/article',
            ],
          },
        ],
      };
      expect(jsonLogic.apply(mockRules, {
        urls: '/fashion/article'
      })).toBe(true);
      expect(jsonLogic.apply(mockRules, {
        urls: '/fashion'
      })).toBe(false);
    });
  });
});
