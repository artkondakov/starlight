export default function (cb, interval) {
  let lastTime = 0;
  return function () {
    const now = new Date();
    if (now - lastTime >= interval) {
      cb();
      lastTime = now;
    }
  };
}
