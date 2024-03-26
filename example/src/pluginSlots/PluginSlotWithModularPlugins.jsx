import React from 'react';

import { PluginSlot } from '@openedx/frontend-plugin-framework';
import ModularComponent from '../components/ModularComponent';

function PluginSlotWithModularPlugins() {
  const content = {
    title: 'Default Content',
    uniqueText: 'Default content are set with a priority of 50, which is why it appears second in this slot.',
  }

  return (
    <div className="border border-primary mb-2">
      <h2 className="pl-3">Direct Plugins Using Modular Components</h2>
      <PluginSlot
        id="slot_with_modular_plugins"
        data-testid="testing"
      >
        <ModularComponent content={content} />
      </PluginSlot>
    </div>
  );
}
export default PluginSlotWithModularPlugins;
