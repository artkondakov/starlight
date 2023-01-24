export default function (cookieString = '', cookieName = '') {
  const extendedCookiesString = `; ${cookieString}`;
  const splitted = extendedCookiesString.split(`; ${cookieName}=`);
  return splitted.length === 2 ? splitted.pop().split(';').shift() : undefined;
}
