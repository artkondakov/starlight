module.exports = {
    globals: {
      alert: true,
      history: true,

    },
    extends: [
      "react-app",
      "react-app/jest",
      "airbnb",
      "airbnb-typescript",
      "plugin:import/typescript"
    ],
    plugins: ['jest'],
    rules: {
      'import/extensions': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      'import/resolver': {
        webpack: {
          config: './webpack/webpack.production.config.js',
        },
      },
    },
  };
  