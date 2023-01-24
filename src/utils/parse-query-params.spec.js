/* eslint-disable @typescript-eslint/camelcase */
import parseQueryParams from './parse-query-params';

describe('Convert query string to object', () => {
  let search =
    '?utm_source=facebook&utm_medium=smm&fbclid=IwAR1JFIlFXMsxtb7Sxg2zKRlK0CcXf3etLUJINgVj2ARXRwGmjm_KND47J5g';

  it('return empty object if search is empty;', () => {
    expect(parseQueryParams('')).toStrictEqual({});
    expect(parseQueryParams('?')).toStrictEqual({});
  });

  it('should return object with keys', () => {
    expect(parseQueryParams(search)).toStrictEqual({
      utm_source: 'facebook',
      utm_medium: 'smm',
      fbclid: 'IwAR1JFIlFXMsxtb7Sxg2zKRlK0CcXf3etLUJINgVj2ARXRwGmjm_KND47J5g',
    });
  });

  it('should parse URI', () => {
    expect(parseQueryParams('?utm_source=dash%20hudson')).toStrictEqual({
      utm_source: 'dash hudson',
    });
  });

  it('should return undefined value of empty param', () => {
    search += '&flag';
    const parsed = parseQueryParams(search);

    expect(typeof parsed.flag).toBe('undefined');
  });
});
