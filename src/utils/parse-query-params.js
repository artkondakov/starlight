/* eslint-disable prefer-const */
export default function (queryString) {
  const cleared = queryString.substring(1);
  if (!cleared.length) return {};
  const pairs = cleared.split('&');
  const parsed = {};
  pairs.forEach(p => {
    let [k, v] = p.split('=');
    if (v) v = decodeURIComponent(v);
    parsed[k] = v;
  });
  return parsed;
}
