import React, { useCallback } from "react";

import { PluginSlot, usePluginCallback } from "@edx/frontend-plugin-framework";

function PluginSlotWithCallbackOverride() {
  const [items, setItems] = React.useState([]);

  const addItem = useCallback(() => [...items, "Main click"], [items]);

  const mainFrameButtonClick = () => setItems(addItem());

  const pluginCallbackFn = usePluginCallback("pluginOverride", addItem);

  const pluginButtonClick = () =>
    setItems(pluginCallbackFn);

  return (
    <div className="border border-primary mb-2">
      <h2 className="pl-3">Direct Plugins with callback override</h2>
      <section className="bg-light p-3">
        <h3>
          This modular is direct plugin but showing case how the main can us
          the callback defined in within the plugin.
        </h3>
        <p>
          When you click the button for main, only main should trigger. When you
          click the plugin, it would call main then plugin. Below are the events
          getting triggered:
        </p>
        <ul>
          {items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <button onClick={mainFrameButtonClick}>Main frame only click</button>
        <button onClick={pluginButtonClick}>Plugin callback click</button>
      </section>
      <PluginSlot
        id="slot_with_callback_override"
        data-testid="testing"
      ></PluginSlot>
    </div>
  );
}
export default PluginSlotWithCallbackOverride;
