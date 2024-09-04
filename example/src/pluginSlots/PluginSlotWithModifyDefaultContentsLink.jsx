import React from 'react';

import { PluginSlot } from '@openedx/frontend-plugin-framework';
import classNames from 'classnames';


// Example component used as the default childen within a PluginSlot
const LinkExample = ({ href, content, ...rest }) => {
  return <a href={href} {...rest}>Hello world</a>;
};

function PluginSlotWithModifyDefaultContentsLink({ id, label }) {
  return (
    <div className="border border-primary px-3">
      <h3 id={id}>{label}</h3>
      <p>
        The following <code>PluginSlot</code> examples demonstrate the <code>PLUGIN_OPERATIONS.Modify</code> operation, when
        the <code>widgetId</code> is <code>default_contents</code>. Any configured, custom plugin <code>content</code> is
        merged with any existing props passed to the component(s) represented by <code>default_contents</code>.
      </p>
      <ul>
        <li>Custom <code>className</code> overrides are concatenated with the <code>className</code> prop passed to the <code>default_contents</code> component(s), if any.</li>
        <li>Custom <code>style</code> overrides are shallow merged with the <code>style</code> prop passed to the <code>default_contents</code> component(s), if any.</li>
        <li>Custom event handlers (e.g., <code>onClick</code>) are executed in sequence, after any event handlers passed to the <code>default_contents</code> component(s), if any.</li>
      </ul>
      <PluginSlot
        id="slot_with_hyperlink"
        as="div"
        // Default slotOptions
        slotOptions={{
          mergeProps: true,
        }}
      >
        <LinkExample
          href="https://google.com"
        />
      </PluginSlot>
    </div>
  );
}

export default PluginSlotWithModifyDefaultContentsLink;
