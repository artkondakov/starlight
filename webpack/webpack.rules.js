const path = require('path');

module.exports = [
  {
    test: /\.tsx?$/,
    use: 'ts-loader',
    include: [
      path.resolve(__dirname, '..', 'src'),
      path.resolve(__dirname, '..', 'demo'),
    ],
    exclude: /node_modules/,
  },
];
