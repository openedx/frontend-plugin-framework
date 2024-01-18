import '@testing-library/jest-dom';

import organizePlugins from './utils';
import { DirectPluginOperations } from './DirectPlugin';

const mockModifyWidget = (widget) => {
  const newContent = {
    url: '/search',
    label: 'Search',
  };
  const modifiedWidget = widget;
  modifiedWidget.content = newContent;
  return modifiedWidget;
};

function mockWrapWidget({ widget }) {
  const isAdmin = true;
  return isAdmin ? widget : null;
}

const mockSlotChanges = [
  {
    op: DirectPluginOperations.Wrap,
    widgetId: 'drafts',
    wrapper: mockWrapWidget,
  },
  {
    op: DirectPluginOperations.Hide,
    widgetId: 'home',
  },
  {
    op: DirectPluginOperations.Modify,
    widgetId: 'lookUp',
    fn: mockModifyWidget,
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
      expect(plugins.length).toEqual(3);
      expect(plugins).toEqual(mockDefaultContent);
    });

    it('should remove plugins with DirectOperation.Hide', () => {
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'home');
      expect(plugins.length).toEqual(4);
      expect(widget.hidden).toBe(true);
    });

    it('should modify plugins with DirectOperation.Modify', () => {
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'lookUp');

      expect(plugins.length).toEqual(4);
      expect(widget.content.url).toEqual('/search');
    });

    it('should wrap plugins with DirectOperation.Wrap', () => {
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
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
      mockSlotChanges.push(newPluginChange);
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
      const widget = plugins.find((w) => w.id === 'drafts');
      expect(plugins.length).toEqual(4);
      expect(widget.wrappers.length).toEqual(2);
      expect(widget.wrappers[0]).toEqual(mockWrapWidget);
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
      mockSlotChanges.push(newPluginChange);
      const plugins = organizePlugins(mockDefaultContent, mockSlotChanges);
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
      mockSlotChanges.push(badPluginChange);

      expect.assertions(1);
      try {
        await organizePlugins(mockDefaultContent, mockSlotChanges);
      } catch (error) {
        expect(error.message).toBe('unknown direct plugin change operation');
      }
    });
  });
});
