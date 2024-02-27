import React from 'react';
import { ensureConfig } from '@edx/frontend-platform/config';

import { PluginSlot } from '@edx/frontend-plugin-framework';

ensureConfig([
  'pluginSlots'
], 'ExamplePage');

const ExamplePluginSlot = () => (
  <PluginSlot
    id="slot_with_two_iframes"
    data-testid="testing"
  >
    <h3>====== Default content that lives in slot ======</h3>
  </PluginSlot>
);

export default ExamplePluginSlot;