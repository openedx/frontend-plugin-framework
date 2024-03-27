import React from 'react';

import { PluginSlot } from '@openedx/frontend-plugin-framework';

function PluginSlotWithoutDefault() {
  return (
    <div className="border border-primary mb-2">
      <h2 className="pl-3">Default Content Set to False</h2>
      <PluginSlot
        id="slot_without_default"
        data-testid="testing"
      >
      </PluginSlot>
    </div>
  );
}
export default PluginSlotWithoutDefault;