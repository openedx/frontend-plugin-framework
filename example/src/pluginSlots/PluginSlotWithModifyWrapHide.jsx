import React from 'react';

import { PluginSlot } from '@openedx/frontend-plugin-framework';
import ModularComponent from '../components/ModularComponent';


function PluginSlotWithModifyWrapHide() {
  const content = {
    title: 'Default Content',
    uniqueText:  "Because this modular component is default content, this text is passed in as a prop within PluginSlot."
  }

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
