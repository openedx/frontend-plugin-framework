import React from 'react';

import { PluginSlot } from '@edx/frontend-plugin-framework';

const PluginSlotWithInsert = () => (
  <div className='border border-primary'>
    <h2 className='pl-3'>Plugin Operation: Insert</h2>
    <PluginSlot
      id="slot_with_insert_operation"
      data-testid="testing"
    >
    </PluginSlot>
  </div>
);

export default PluginSlotWithInsert;