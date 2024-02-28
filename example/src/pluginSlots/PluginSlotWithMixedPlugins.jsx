import React from 'react';

import { PluginSlot } from '@edx/frontend-plugin-framework';

const PluginSlotWithMixedPlugins = () => (
  <PluginSlot
    id="slot_with_mixed_plugins"
    data-testid="testing"
  >
  </PluginSlot>
);

export default PluginSlotWithMixedPlugins;