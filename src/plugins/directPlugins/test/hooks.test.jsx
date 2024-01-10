import '@testing-library/jest-dom';

import * as hooks from '../hooks';
import { DirectPluginOperations } from '../DirectPlugin';

jest.unmock('../hooks');

const mockModifyComponent = (widget) => {
  const newContent = {
    url: '/search',
    label: 'Search',
  };
  const modifiedWidget = widget;
  modifiedWidget.content = newContent;
  return modifiedWidget;
};

function mockWrapComponent({ widget }) {
  const isAdmin = true;
  return isAdmin ? widget : null;
}

const mockEnabledPlugins = [
  {
    op: DirectPluginOperations.Wrap,
    widgetId: 'drafts',
    wrapper: mockWrapComponent,
  },
  {
    op: DirectPluginOperations.Hide,
    widgetId: 'home',
  },
  {
    op: DirectPluginOperations.Modify,
    widgetId: 'lookUp',
    fn: mockModifyComponent,
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

  describe('when there is no defaultContent', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

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
    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an array of defaultContent if no enabledPlugins', () => {
      const plugins = hooks.organizePlugins(mockDefaultContent, []);
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
      const plugins = hooks.organizePlugins(mockDefaultContent, mockEnabledPlugins);
      const widget = plugins.find((w) => w.id === 'lookUp');

      expect(plugins.length).toEqual(4);
      expect(widget.content.url).toEqual('/search');
    });

    it('should wrap plugins with DirectOperation.Wrap', () => {
      const plugins = hooks.organizePlugins(mockDefaultContent, mockEnabledPlugins);
      const widget = plugins.find((w) => w.id === 'drafts');
      expect(plugins.length).toEqual(4);
      expect(widget.wrappers.length).toEqual(1);
    });

    it('should accept several wrappers for a single plugin with DirectOperation.Wrap', () => {
      const newMockWrapComponent = ({ widget }) => {
        const isStudent = false;
        return isStudent ? null : widget;
      };
      const newPluginChange = {
        op: DirectPluginOperations.Wrap,
        widgetId: 'drafts',
        wrapper: newMockWrapComponent,
      };
      mockEnabledPlugins.push(newPluginChange);
      const plugins = hooks.organizePlugins(mockDefaultContent, mockEnabledPlugins);
      const widget = plugins.find((w) => w.id === 'drafts');
      expect(plugins.length).toEqual(4);
      expect(widget.wrappers.length).toEqual(2);
      expect(widget.wrappers[0]).toEqual(mockWrapComponent);
      expect(widget.wrappers[1]).toEqual(newMockWrapComponent);
    });

    it('should return plugins arranged by priority', () => {
      const newPluginChange = {
        op: DirectPluginOperations.Insert,
        widget: {
          id: 'profile',
          priority: 1,
          content: {
            url: '/profile', label: 'Profile',
          },
        },
      };
      mockEnabledPlugins.push(newPluginChange);
      const plugins = hooks.organizePlugins(mockDefaultContent, mockEnabledPlugins);
      expect(plugins.length).toEqual(5);
      expect(plugins[0].id).toBe('profile');
      expect(plugins[1].id).toBe('home');
      expect(plugins[2].id).toBe('lookUp');
      expect(plugins[3].id).toBe('drafts');
      expect(plugins[4].id).toBe('login');
    });

    it('should raise an error for an operation that does not exist', async () => {
      const badPluginChange = {
        op: DirectPluginOperations.Destroy,
        widgetId: 'drafts',
      };
      mockEnabledPlugins.push(badPluginChange);

      expect.assertions(1);
      try {
        await hooks.organizePlugins(mockDefaultContent, mockEnabledPlugins);
      } catch (error) {
        expect(error.message).toBe('unknown direct plugin change operation');
      }
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
