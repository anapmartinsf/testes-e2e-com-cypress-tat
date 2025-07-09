module.exports = {
  env: {
    node: true,
    browser: true,
    'cypress/globals': true,
  },
  plugins: ['cypress'],
  extends: ['eslint:recommended', 'plugin:cypress/recommended'],
};
