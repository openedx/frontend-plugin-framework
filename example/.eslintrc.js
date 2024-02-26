const { getBaseConfig } = require('@edx/frontend-build');

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
  'jsx-a11y/anchor-is-valid': ['error', {
    components: ['Link'],
    specialLink: ['to'],
    aspects: ['noHref', 'invalidHref', 'preferButton'],
  }],
  'react/react-in-jsx-scope': ['error'],
};

module.exports = config;
