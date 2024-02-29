const { getBaseConfig } = require('@openedx/frontend-build');

const config = getBaseConfig('eslint');

config.rules = {
  'import/no-extraneous-dependencies': ['error', {
    devDependencies: true,
  }],
  'import/no-unresolved': ['error', {
    ignore: ['@edx/frontend-plugin-framework*'],
  }],
};

module.exports = createConfig('eslint');
