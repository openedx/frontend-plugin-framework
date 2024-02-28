import React from 'react';

import { PluginSlot } from '@edx/frontend-plugin-framework';

const PluginSlotWithIFrames = () => (
  <PluginSlot
    id="slot_with_two_iframes"
    data-testid="testing"
  >
  </PluginSlot>
);

export default PluginSlotWithIFrames;