import React from 'react';

import { PluginSlot } from '@edx/frontend-plugin-framework';

function PluginSlotWithInsert() {
  return (
    <div className="border border-primary mb-2">
      <h2 className="pl-3">Plugin Operation: Insert</h2>
      <PluginSlot
        id="slot_with_insert_operation"
        data-testid="testing"
      />
    </div>
  );
}

export default PluginSlotWithInsert;
