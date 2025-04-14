import '@testing-library/jest-dom';
import { getConfig } from '@edx/frontend-platform';
import { usePluginSlot } from './hooks';

import { IFRAME_PLUGIN, PLUGIN_OPERATIONS } from './constants';

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
];

jest.mock('@edx/frontend-platform');

describe('usePluginSlots', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  describe('when the plugin slot is defined', () => {
    it('returns keepDefault and plugin changes', () => {
      getConfig.mockImplementation(() => (
        {
          pluginSlots: {
            example_plugin_slot: {
              plugins: mockSlotChanges,
              keepDefault: true,
            },
          },
        }
      ));

      const slotConfig = usePluginSlot('example_plugin_slot');
      expect(slotConfig.keepDefault).toBe(true);
      expect(slotConfig.plugins).toBe(mockSlotChanges);
    });
  });

  describe('when the plugin slot is not defined', () => {
    it('returns true for keepDefault and no plugin changes', () => {
      getConfig.mockImplementation(() => {});

      const slotConfig = usePluginSlot('example_plugin_slot');

      expect(slotConfig.keepDefault).toBe(true);
      expect(slotConfig.plugins).toStrictEqual([]);
    });
  });

  describe('when the plugin slot is defined via alias', () => {
    it('returns keepDefault and plugin changes', () => {
      getConfig.mockImplementation(() => (
        {
          pluginSlots: {
            example_plugin_slot_alias: {
              plugins: mockSlotChanges,
              keepDefault: true,
            },
          },
        }
      ));

      const slotConfig = usePluginSlot('example_plugin_slot', ['example_plugin_slot_alias']);
      expect(slotConfig.keepDefault).toBe(true);
      expect(slotConfig.plugins).toBe(mockSlotChanges);
    });
  });

  describe('when no matching plugin slot is found', () => {
    it('returns true for keepDefault and no plugin changes', () => {
      getConfig.mockImplementation(() => (
        {
          pluginSlots: {
            wrong_plugin_slot_alias: {
              plugins: mockSlotChanges,
              keepDefault: true,
            },
          },
        }
      ));

      const slotConfig = usePluginSlot('example_plugin_slot', ['example_plugin_slot_alias']);
      expect(slotConfig.keepDefault).toBe(true);
      expect(slotConfig.plugins).toStrictEqual([]);
    });
  });

  describe('when the defined plugin is null', () => {
    it('returns true for keepDefault and no plugin changes', () => {
      getConfig.mockImplementation(() => (
        {
          pluginSlots: {
            example_plugin_slot_alias: null,
          },
        }
      ));

      const slotConfig = usePluginSlot('example_plugin_slot', ['example_plugin_slot_alias']);
      expect(slotConfig.keepDefault).toBe(true);
      expect(slotConfig.plugins).toStrictEqual([]);
    });
  });
});
