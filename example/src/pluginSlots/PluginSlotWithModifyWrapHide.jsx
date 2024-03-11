import React from 'react';

import { PluginSlot } from '@edx/frontend-plugin-framework';
import ModularComponent from '../components/ModularComponent';

const content = {
  title: 'Default Content',
  uniqueText:  "This widget's content will be modified by the Modify operation in the JS config."
}

function PluginSlotWithModifyWrapHide() {
  return (
    <div className="border border-primary mb-2">
      <h2 className="pl-3">Plugin Operation: Modify, Wrap, and Hide</h2>
      <PluginSlot
        id="slot_with_modify_wrap_hidden_operations"
        data-testid="testing"
      >
        <ModularComponent content={content}/>
      </PluginSlot>
    </div>
  );
}

export default PluginSlotWithModifyWrapHide;
