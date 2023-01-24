module.exports = function(env, { mode }) {
  console.log(`Webpack mode: ${mode}`);
  return require(`./webpack/webpack.${mode}.config.js`);
}
