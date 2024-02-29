import React from 'react';

import { PluginSlot } from '@edx/frontend-plugin-framework';

function PluginSlotWithModularPlugins() {
  return (
    <div className="border border-primary mb-2">
      <h2 className="pl-3">Direct Plugins Using Modular Components</h2>
      <PluginSlot
        id="slot_with_modular_plugins"
        data-testid="testing"
      />
    </div>
  );
}
export default PluginSlotWithModularPlugins;
