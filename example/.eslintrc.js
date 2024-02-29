const { getBaseConfig } = require('@openedx/frontend-build');

const config = getBaseConfig('eslint');

config.rules = {
  'import/no-extraneous-dependencies': ['error', {
    devDependencies: true,
  }],
  'import/extensions': ['error', {
    ignore: ['@edx/frontend-platform*'],
  }],
  'import/no-unresolved': ['error', {
    ignore: ['@edx/frontend-platform*'],
  }],
  'react/react-in-jsx-scope': ['error'],
};

module.exports = config;
