/* eslint-disable import/no-extraneous-dependencies */
/* eslint react/prop-types: off */

// import React from 'react';
// import { render } from '@testing-library/react';
// import { fireEvent } from '@testing-library/dom';
// import '@testing-library/jest-dom';

// import {
//   FormattedMessage,
//   IntlProvider,
// } from '@edx/frontend-platform/i18n';

// import { isAdminHelper, navLinksPlugin } from './mocks/PluginComponentsMock';

/*
test for
when given a plugin config with default content but no changes, return only default content
when using insert, plugin is unchanged
when using modify, plugin is changed
when using hide, plugin is missing
when using wrap (use plugin components mock for this), plugin renders based on condition
when using wrap, plugin has wrapped component (refer to classname)
*/

describe('When given a pluginConfig', () => {
  describe('when there is no defaultContent', () => {
    it('should return an empty array when there are no changes', () => {
    });
    it('should return an array of only new plugins inserted', () => {

    });
  });
  describe('when there is defaultContent', () => {
    it('should return the same default plugins if no changes', () => {

    });
    it('should return an array with each plugin including property "hidden" if operation is Hidden', () => {

    });
  });
});
