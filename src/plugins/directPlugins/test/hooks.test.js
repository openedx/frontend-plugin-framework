// import React from 'react';
import '@testing-library/jest-dom';

import * as hooks from '../hooks';
import { DirectPluginOperations } from '../DirectPlugin';

jest.unmock('../hooks');

let mockEnabledPlugins = [
  {
    op: DirectPluginOperations.Wrap,
    widgetId: 'drafts',
    wrapper: jest.fn(),
  },
  {
    op: DirectPluginOperations.Hide,
    widgetId: 'home',
  },
  {
    op: DirectPluginOperations.Modify,
    widgetId: 'lookUp',
    fn: jest.fn((widget) => widget),
  },
  {
    op: DirectPluginOperations.Insert,
    widget: {
      id: 'login',
      priority: 50,
      content: {
        url: '/login', label: 'Login',
      },
    },
  },
];

const mockModifyComponent = (widget) => {
  const newContent = {
    url: '/search',
    label: 'Search',
  };
  const modifiedWidget = widget;
  modifiedWidget.content = newContent;
  return modifiedWidget;
};

const mockDefaultContent = [
  {
    id: 'home',
    priority: 5,
    content: { url: '/', label: 'Home' },
  },
  {
    id: 'lookUp',
    priority: 25,
    content: { url: '/lookup', label: 'Lookup' },
  },
  {
    id: 'drafts',
    priority: 35,
    content: { url: '/drafts', label: 'Drafts' },
  },
];

describe('organizePlugins', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('when there is no defaultContent', () => {
    it('should return an empty array when there are no enabledPlugins', () => {
      const plugins = hooks.organizePlugins([], []);
      expect(plugins.length).toBe(0);
      expect(plugins).toEqual([]);
    });

    it('should return an array of changes for non-default plugins', () => {
      const plugins = hooks.organizePlugins([], mockEnabledPlugins);
      expect(plugins.length).toEqual(1);
      expect(plugins[0].id).toEqual('login');
    });
  });

  describe('when there is defaultContent', () => {
    it('should return an array of defaultContent if no enabledPlugins', () => {
      mockEnabledPlugins = [];
      const plugins = hooks.organizePlugins(mockDefaultContent, mockEnabledPlugins);
      expect(plugins.length).toEqual(3);
      expect(plugins).toEqual(mockDefaultContent);
    });

    it('should remove plugins with DirectOperation.Hide', () => {
      const plugins = hooks.organizePlugins(mockDefaultContent, mockEnabledPlugins);
      const widget = plugins.find((w) => w.id === 'home');
      expect(plugins.length).toEqual(4);
      expect(widget.hidden).toBe(true);
    });

    it('should modify plugins with DirectOperation.Modify', () => {
      const pluginToModify = mockEnabledPlugins.find(w => w.widgetId === 'lookUp');
      pluginToModify.fn = mockModifyComponent;
      const plugins = hooks.organizePlugins(mockDefaultContent, mockEnabledPlugins);
      const widget = plugins.find((w) => w.id === 'lookUp');

      expect(plugins.length).toEqual(4);
      expect(widget.content.url).toEqual('/search');
    });
  });
});

describe('useGetPlugins', () => {
  // navLinksPlugin.defaultComponentProps = jest.fn(() => []);
  // navLinksPlugin.getDirectSlotChanges = jest.fn(() => (
  //   {
  //     'side-nav-bar': [],
  //   }
  // ));
  // beforeEach(jest.clearAllMocks);

  // it('should return an array if only new plugins inserted', () => {
  //   navLinksPlugin.getDirectSlotChanges = jest.fn(() => (
  //     {
  //       'side-nav-bar': [
  //         {
  //           op: DirectPluginOperations.Insert,
  //           widget: {
  //             id: 'login',
  //             priority: 50,
  //             content: {
  //               url: '/login', icon: Login, label: 'Login',
  //             },
  //           },
  //         },
  //       ],
  //     }
  //   ));

  //   const expectedChanges = {
  //     'side-nav-bar': [
  //       {
  //         widget: {
  //           id: 'login',
  //           priority: 50,
  //           content: {
  //             url: '/login', icon: Login, label: 'Login',
  //           },
  //         },
  //       },
  //     ],
  //   };

  //   expect(navLinksPlugin.useGetPlugins.length()).toBe(1);
  //   expect(navLinksPlugin.useGetPlugins).toBe(expectedChanges);
  // });
});
