// eslint-disable-next-line import/no-extraneous-dependencies
const { createConfig } = require('@openedx/frontend-build');

const config = createConfig('eslint');

config.rules = {
  'import/no-unresolved': ['error', {
    ignore: ['@edx/frontend-plugin-framework/example*'],
  }],
  'import/no-extraneous-dependencies': ['error', {
    devDependencies: true,
  }],
};

config.ignorePatterns = [
  'example*',
];

module.exports = config;
