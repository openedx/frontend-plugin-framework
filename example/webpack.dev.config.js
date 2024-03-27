const path = require('path');
const { createConfig } = require('@openedx/frontend-build');

module.exports = createConfig('webpack-dev', {
  resolve: {
    alias: {
      // Note: these four aliases are a manual version of what module.config.js solves in our
      // applications. Because this example app is using code from the parent frontend-plugin-framework
      // library, it runs into the same issues our applications do when loading libraries from
      // local source, rather than from their node_modules directory.
      '@openedx/frontend-plugin-framework': path.resolve(__dirname, '..', 'dist'),
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-dom': path.resolve(__dirname, 'node_modules', 'react-dom'),
      'react-router-dom': path.resolve(__dirname, 'node_modules', 'react-router-dom'),
    },
  },
});
