/* eslint react/prop-types: off */

import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { logError } from '@edx/frontend-platform/logging';

import {
  getConfigSlots, organizePlugins, validatePlugin, wrapComponent,
} from './utils';

import { PLUGIN_OPERATIONS, IFRAME_PLUGIN, DIRECT_PLUGIN } from './constants';

const mockModifyWidget = (widget) => {
  const modifiedWidget = widget;
  modifiedWidget.url = '/search';
  modifiedWidget.title = 'Search';
  return modifiedWidget;
};

const mockIsAdminWrapper = ({ widget }) => {
  const isAdmin = true;
  return isAdmin ? widget : null;
};

const makeMockElementWrapper = (testId = 0) => function MockElementWrapper({ component, pluginProps }) {
  return (
    <div data-testid={`wrapper${testId}`}>
      {pluginProps?.prop1 && `This is a wrapper with ${pluginProps?.prop1}.`}
      {component}
    </div>
  );
};

const mockRenderWidget = () => (
  <div data-testid="widget">
    This is a widget.
  </div>
);

const mockSlotChanges = [
  {
    op: PLUGIN_OPERATIONS.Insert,
    widget: {
      id: 'login',
      priority: 50,
      type: IFRAME_PLUGIN,
      url: '/login',
      title: 'Login',
    },
  },
  {
    op: PLUGIN_OPERATIONS.Wrap,
    widgetId: 'login',
    wrapper: mockIsAdminWrapper,
  },
  {
    op: PLUGIN_OPERATIONS.Hide,
    widgetId: 'default_contents',
  },
  {
    op: PLUGIN_OPERATIONS.Modify,
    widgetId: 'login',
    fn: mockModifyWidget,
  },
];

const mockDefaultContent = [{
  id: 'default_contents',
  keepDefault: true,
  priority: 50,
  RenderWidget: jest.fn(),
}];

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(() => ({
    pluginSlots: {
      example_plugin_slot: {
        plugins: mockSlotChanges,
        keepDefault: true,
      },
    },
  })),
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

describe('organizePlugins', () => {
  describe('when there is no defaultContent', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an empty array when there are no changes or additions to slot', () => {
      const plugins = organizePlugins([], []);
      expect(plugins.length).toBe(0);
      expect(plugins).toEqual([]);
    });

    it('should return an array of changes for non-default plugins', () => {
      const plugins = organizePlugins([], mockSlotChanges);
      expect(plugins.length).toEqual(1);
      expect(plugins[0].id).toEqual('login');
    });
  });

  describe('when there is defaultContent', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an array of defaultContent if no changes for plugins in slot', () => {
      const plugins = organizePlugins(mockDefaultContent, []);
      expect(plugins.length).toEqual(1);
      expect(plugins).toEqual(mockDefaultContent);
    });

    it('should remove plugins with PluginOperation.Hide', () => {
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'default_contents');
      expect(plugins.length).toEqual(2);
      expect(widget.hidden).toBe(true);
    });

    it('should modify plugins with PluginOperation.Modify', () => {
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'login');

      expect(plugins.length).toEqual(2);
      expect(widget.url).toEqual('/search');
    });

    it('should wrap plugins with PluginOperation.Wrap', () => {
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'login');
      expect(plugins.length).toEqual(2);
      expect(widget.wrappers.length).toEqual(1);
    });

    it('should accept several wrappers for a single plugin with PluginOperation.Wrap', () => {
      const newMockWrapComponent = ({ widget }) => {
        const isStudent = false;
        return isStudent ? null : widget;
      };
      const newPluginChange = {
        op: PLUGIN_OPERATIONS.Wrap,
        widgetId: 'login',
        wrapper: newMockWrapComponent,
      };
      mockSlotChanges.push(newPluginChange);
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'login');
      expect(plugins.length).toEqual(2);
      expect(widget.wrappers.length).toEqual(2);
      expect(widget.wrappers[0]).toEqual(mockIsAdminWrapper);
      expect(widget.wrappers[1]).toEqual(newMockWrapComponent);
    });

    it('should return plugins arranged by priority', () => {
      const newPluginChange = {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'profile',
          priority: 1,
          type: IFRAME_PLUGIN,
          url: '/profile',
          title: 'Profile',
        },
      };
      mockSlotChanges.push(newPluginChange);
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      expect(plugins.length).toEqual(3);
      expect(plugins[0].id).toBe('profile');
      expect(plugins[1].id).toBe('default_contents');
      expect(plugins[2].id).toBe('login');
    });

    it('should not insert a plugin that is missing a required property', () => {
      const plugins = organizePlugins(mockDefaultContent, [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'no_priority_plugin',
            type: DIRECT_PLUGIN,
            RenderWidget: mockRenderWidget,
          },
        },
      ]);
      expect(plugins.length).toEqual(1);
      expect(plugins.find((w) => w.id === 'no_priority_plugin')).toBeUndefined();
      expect(logError).toHaveBeenCalledWith('the insert operation config is invalid for widget id: no_priority_plugin');
    });

    it('should ignore operations targeting a plugin that failed validation', () => {
      const plugins = organizePlugins(mockDefaultContent, [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'no_priority_plugin',
            type: DIRECT_PLUGIN,
            RenderWidget: mockRenderWidget,
          },
        },
        {
          op: PLUGIN_OPERATIONS.Modify,
          widgetId: 'no_priority_plugin',
          fn: mockModifyWidget,
        },
        {
          op: PLUGIN_OPERATIONS.Wrap,
          widgetId: 'no_priority_plugin',
          wrapper: makeMockElementWrapper(),
        },
      ]);
      expect(plugins.length).toEqual(1);
      expect(plugins[0].id).toBe('default_contents');
    });

    it('should preserve the priority ordering of valid plugins when an insert is invalid', () => {
      const plugins = organizePlugins(mockDefaultContent, [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'second_plugin',
            priority: 30,
            type: DIRECT_PLUGIN,
            RenderWidget: mockRenderWidget,
          },
        },
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'no_priority_plugin',
            type: DIRECT_PLUGIN,
            RenderWidget: mockRenderWidget,
          },
        },
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'first_plugin',
            priority: 10,
            type: DIRECT_PLUGIN,
            RenderWidget: mockRenderWidget,
          },
        },
      ]);
      expect(plugins.map((w) => w.id)).toEqual(['first_plugin', 'second_plugin', 'default_contents']);
    });
  });
});

describe('wrapComponent', () => {
  describe('when provided with a single wrapper in an array', () => {
    it('should wrap the provided component', () => {
      const wrappedComponent = wrapComponent(mockRenderWidget, [makeMockElementWrapper()], { prop1: 'prop1' });

      const { getByTestId } = render(wrappedComponent);

      const wrapper = getByTestId('wrapper0');
      const widget = getByTestId('widget');

      expect(wrapper).toContainElement(widget);
      expect(wrapper).toHaveTextContent('This is a wrapper with prop1.');
    });

    it('should wrap the provided component without passing props', () => {
      const wrappedComponent = wrapComponent(mockRenderWidget, [makeMockElementWrapper()]);

      const { getByTestId } = render(wrappedComponent);

      const wrapper = getByTestId('wrapper0');
      const widget = getByTestId('widget');

      expect(wrapper).toContainElement(widget);
      expect(wrapper).not.toHaveTextContent('This is a wrapper with prop1.');
    });
  });
  describe('when provided with multiple wrappers in an array', () => {
    it('should wrap starting with the first wrapper in the array', () => {
      const wrappedComponent = wrapComponent(
        mockRenderWidget,
        [makeMockElementWrapper(), makeMockElementWrapper(1), makeMockElementWrapper(2)],
      );

      const { getByTestId } = render(wrappedComponent);

      const innermostWrapper = getByTestId('wrapper0');
      const middleWrapper = getByTestId('wrapper1');
      const outermostWrapper = getByTestId('wrapper2');
      const widget = getByTestId('widget');

      expect(innermostWrapper).toContainElement(widget);
      expect(middleWrapper).toContainElement(innermostWrapper);
      expect(outermostWrapper).toContainElement(middleWrapper);
    });
  });
});

describe('getConfigSlots', () => {
  it('returns the plugin slots from the Config Document', () => {
    const expected = {
      example_plugin_slot: {
        plugins: mockSlotChanges,
        keepDefault: true,
      },
    };
    expect(getConfigSlots()).toStrictEqual(expected);
  });
});

describe('validatePlugin', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('insert plugin configuration', () => {
    it('returns true if the plugin config is correctly configured', () => {
      const insertDirectConfig = {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'new_plugin',
          priority: 10,
          type: DIRECT_PLUGIN,
          RenderWidget: mockRenderWidget,
        },
      };
      const insertIFrameConfig = {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'new_plugin',
          priority: 10,
          type: IFRAME_PLUGIN,
          title: 'iframe plugin',
          url: 'example.url.com',
        },
      };
      const insertDirectModularConfig = {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'inserted_plugin',
          type: DIRECT_PLUGIN,
          priority: 10,
          RenderWidget: mockRenderWidget,
          content: {
            title: 'Modular Direct Plugin',
            uniqueText: 'This is some text.',
          },
        },
      };

      expect(validatePlugin(insertDirectConfig)).toBe(true);
      expect(validatePlugin(insertIFrameConfig)).toBe(true);
      expect(validatePlugin(insertDirectModularConfig)).toBe(true);
    });

    it('returns error message if the plugin config is incorrectly configured', () => {
      // missing id for Direct Plugin
      const insertBrokenDirectConfig = {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          priority: 10,
          type: DIRECT_PLUGIN,
          RenderWidget: mockRenderWidget,
        },
      };
      // missing RenderWidget for Direct Plugin
      const insertBrokenDirectConfig2 = {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'new_plugin',
          priority: 10,
          type: DIRECT_PLUGIN,
        },
      };
      // properties need to be wrapped in widget key
      const insertBrokenDirectConfig3 = {
        op: PLUGIN_OPERATIONS.Insert,
        id: 'new_plugin',
        priority: 10,
        type: DIRECT_PLUGIN,
        RenderWidget: mockRenderWidget,
      };
      // missing title for iFrame Plugin
      const insertBrokenIFrameConfig = {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'new_iframe_plugin',
          priority: 10,
          type: IFRAME_PLUGIN,
          url: 'www.example_url.com',
        },
      };
      // missing plugin type
      const insertBrokenIFrameConfig2 = {
        op: PLUGIN_OPERATIONS.Insert,
        widget: {
          id: 'new_iframe_plugin',
          priority: 10,
          url: 'www.example_url.com',
        },
      };

      expect(validatePlugin(insertBrokenDirectConfig)).toBe(false);
      expect(logError).toHaveBeenCalledWith('the insert operation config is invalid for widget id: MISSING ID');

      expect(validatePlugin(insertBrokenDirectConfig2)).toBe(false);
      expect(logError).toHaveBeenCalledWith('the insert operation config is invalid for widget id: new_plugin');

      expect(validatePlugin(insertBrokenDirectConfig3)).toBe(false);
      expect(logError).toHaveBeenCalledWith('insert operation config is missing widget object');

      expect(validatePlugin(insertBrokenIFrameConfig)).toBe(false);
      expect(logError).toHaveBeenCalledWith('the insert operation config is invalid for widget id: new_iframe_plugin');

      expect(validatePlugin(insertBrokenIFrameConfig2)).toBe(false);
      expect(logError).toHaveBeenCalledWith('the insert operation config is invalid for widget id: new_iframe_plugin');
    });
  });
  describe('hide plugin configuration', () => {
    it('returns true if the Hidden operation is configured', () => {
      const validHideConfig = {
        op: PLUGIN_OPERATIONS.Hide,
        widgetId: 'default_content',
      };
      expect(validatePlugin(validHideConfig)).toBe(true);
    });
    it('returns an error if the Hidden operation is configured incorrectly', () => {
      const invalidHideConfig = {
        op: PLUGIN_OPERATIONS.Hide,
      };

      expect(validatePlugin(invalidHideConfig)).toBe(false);
      expect(logError).toHaveBeenCalledWith('the hide operation config is invalid for widget id: MISSING ID');
    });
  });
  describe('modify plugin configuration', () => {
    it('returns true if the Modify operation is configured correctly', () => {
      const validModifyConfig = {
        op: PLUGIN_OPERATIONS.Modify,
        widgetId: 'random_plugin',
        fn: mockModifyWidget,
      };
      expect(validatePlugin(validModifyConfig)).toBe(true);
    });
    it('returns an error if the Modify operation is configured incorrectly', () => {
      const invalidModifyConfig1 = {
        op: PLUGIN_OPERATIONS.Modify,
        widgetId: 'random_plugin',
      };
      const invalidModifyConfig2 = {
        op: PLUGIN_OPERATIONS.Modify,
        fn: mockModifyWidget,
      };

      expect(validatePlugin(invalidModifyConfig1)).toBe(false);
      expect(logError).toHaveBeenCalledWith('the modify operation config is invalid for widget id: random_plugin');
      expect(validatePlugin(invalidModifyConfig2)).toBe(false);
      expect(logError).toHaveBeenCalledWith('the modify operation config is invalid for widget id: MISSING ID');
    });
  });
  describe('wrap plugin configuration', () => {
    it('returns true if the Wrap operation is configured correctly', () => {
      const validWrapConfig = {
        op: PLUGIN_OPERATIONS.Wrap,
        widgetId: 'random_plugin',
        wrapper: makeMockElementWrapper(),
      };
      expect(validatePlugin(validWrapConfig)).toBe(true);
    });
    it('returns an error if the Wrap operation is configured incorrectly', () => {
      const invalidWrapConfig1 = {
        op: PLUGIN_OPERATIONS.Wrap,
        widgetId: 'random_plugin',
      };
      const invalidWrapConfig2 = {
        op: PLUGIN_OPERATIONS.Wrap,
        wrapper: makeMockElementWrapper(),
      };

      expect(validatePlugin(invalidWrapConfig1)).toBe(false);
      expect(logError).toHaveBeenCalledWith('the wrap operation config is invalid for widget id: random_plugin');
      expect(validatePlugin(invalidWrapConfig2)).toBe(false);
      expect(logError).toHaveBeenCalledWith('the wrap operation config is invalid for widget id: MISSING ID');
    });
  });
  describe('an invalid plugin configuration', () => {
    it.each([undefined, 'destroy'])('should return false and raise an error for operation "%s"', (op) => {
      const invalidPluginConfig = {
        op,
        widgetId: 'drafts',
      };

      expect(validatePlugin(invalidPluginConfig)).toBe(false);
      expect(logError).toHaveBeenCalledWith('There is a config with an invalid PLUGIN_OPERATION. Check to make sure it is configured correctly.');
    });
  });
});
