import React from 'react';

import { PluginSlot } from '@edx/frontend-plugin-framework';

const PluginSlotWithDirectPlugins = () => (
  <PluginSlot
    id="slot_with_two_direct_plugins"
    data-testid="testing"
  >
  </PluginSlot>
);

export default PluginSlotWithDirectPlugins;