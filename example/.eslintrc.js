const { getBaseConfig } = require('@openedx/frontend-build');
const path = require('path');

const config = getBaseConfig('eslint');

config.rules = {
  'import/no-extraneous-dependencies': ['error', {
    packageDir: path.join(__dirname, '..'),
  }],
  'import/no-unresolved': ['error', {
    ignore: ['@openedx/frontend-plugin-framework*'],
  }],
};

module.exports = config;
