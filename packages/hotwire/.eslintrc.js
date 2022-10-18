module.exports = {
  env: {
    browser: true,
  },
  extends: ['../../.eslintrc.js'],
  overrides: [
    {
      files: ['test/**'],
      rules: {},
    },
  ],
};
