/* eslint-disable no-useless-escape */
import { getCookie } from '../utils';

// Do not use for writing cookies, will be deprecated in upcoming updates
export default {
  set(key, value = '', options = {}) {
    const formattedOptions = this.$formatCookieOptions(options);
    document.cookie = `${key}=${value}${formattedOptions}`
  },

  $formatCookieOptions(options) {
    let resultString = '';
    Object.entries(options).forEach(([k, v]) => {
      let value = v;
      if (k === 'expires') {
        const date = new Date((Date.now() + v));
        value = date.toUTCString();
      }
      resultString += `; ${k}=${value}`;
    });
    if (!Object.keys(options).includes('path')) {
      resultString += '; path=/'
    }
    return resultString;
  },

  get(key) {
    return getCookie(document.cookie, key);
  },

  increment() {
    throw new Error('Do not use \"increment\" method with cookies');
  },
};
