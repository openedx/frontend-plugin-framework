import React from 'react';

import { PluginSlot } from '@edx/frontend-plugin-framework';

const PluginSlotWithModifyWrapHide = () => (
  <div className='border border-primary'>
    <h2 className='pl-3'>Plugin Operation: Modify, Wrap, and Hide</h2>
    <PluginSlot
      id="slot_with_modify_wrap_hidden_operations"
      data-testid="testing"
    >
    </PluginSlot>
  </div>
);

export default PluginSlotWithModifyWrapHide;