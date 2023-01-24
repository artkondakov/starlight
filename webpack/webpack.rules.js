const path = require('path');

module.exports = [
  {
    test: /\.tsx?$/,
    use: 'ts-loader',
    include: [
      path.resolve(__dirname, '..', 'src')
    ],
    exclude: /node_modules/,
  },
];
