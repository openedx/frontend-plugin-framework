import React from 'react';

import { PluginSlot } from '@openedx/frontend-plugin-framework';
import ModularComponent from '../components/ModularComponent';

function PluginSlotWithModularPlugins({ id, label }) {
  const content = {
    title: 'Default Content',
    uniqueText: 'Default content are set with a priority of 50, which is why it appears second in this slot.',
  }

  return (
    <div className="border border-primary">
      <h3 id={id} className="pl-3">{label}</h3>
      <PluginSlot
        id="slot_with_modular_plugins"
      >
        <ModularComponent content={content} />
      </PluginSlot>
    </div>
  );
}
export default PluginSlotWithModularPlugins;
