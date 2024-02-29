import React from 'react';

import { PluginSlot } from '@edx/frontend-plugin-framework';

const PluginSlotWithModularPlugins = () => (
  <div className='border border-primary'>
    <h2 className='pl-3'>Direct Plugins Using Modular Components</h2>
    <PluginSlot
      id="slot_with_modular_plugins"
      data-testid="testing"
    >
    </PluginSlot>
  </div>
);

export default PluginSlotWithModularPlugins;