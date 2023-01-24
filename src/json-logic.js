/* eslint-disable no-eval */
import jsonLogic from 'json-logic-js';

export const makeRegExpString = (str) => `/^${str.replace(/\//g, '\\/').replace('*', '.+')}${str === '/' ? '$' : ''}/gi`;

export const makeCodeString = (regexp, variable) => `(new RegExp(${makeRegExpString(regexp)}).test('${variable}'))`;

const RegExpTest = (field, value) => {
  let trimmed = value;
  if (trimmed.startsWith('"')) trimmed = trimmed.slice(1);
  if (trimmed.endsWith('"')) trimmed = trimmed.slice(0, trimmed.length - 1);

  const multipleRegexps = trimmed.split(',');
  if (Array.isArray(multipleRegexps) && multipleRegexps.length) {
    const allRegexps = multipleRegexps
      .map((r) => makeCodeString(r.trim(), field))
      .join(' || ');
    return eval(allRegexps);
  }
  return false;
};

const NotRegExpTest = (field, value) => !RegExpTest(field, value);

jsonLogic.add_operation('UrlRegExp', RegExpTest);
jsonLogic.add_operation('NotUrlRegExp', NotRegExpTest);

export default jsonLogic;
