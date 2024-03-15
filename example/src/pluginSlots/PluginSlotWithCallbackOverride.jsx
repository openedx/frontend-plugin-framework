import React, { useCallback } from "react";

import { PluginSlot, usePluginContext } from "@edx/frontend-plugin-framework";

function PluginSlotWithCallbackOverride() {
  const [clicks, setClicks] = React.useState([]);
  const pluginContext = usePluginContext();

  const { usePluginCallback } = pluginContext;

  const mainFrameClick = useCallback(() => ['Main frame click']);

  const pluginButtonClick = () => setClicks(usePluginCallback("pluginOverride", mainFrameClick));

  const mainFrameButtonClick = () => setClicks(mainFrameClick());

  const pluginOnlyClick = () => setClicks(usePluginCallback("pluginClickOnly", mainFrameClick));


  return (
    <div className="border border-primary mb-2 m-2">
      <h2 className="pl-3">Direct Plugins with callback override</h2>
      <ul>
        {clicks.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button onClick={mainFrameButtonClick}>Main frame only click</button>
      <button onClick={pluginButtonClick}>Plugin callback click</button>
      <button onClick={pluginOnlyClick}>Plugin only click</button>
      <PluginSlot
        id="slot_with_callback_override"
        data-testid="testing"
      ></PluginSlot>
    </div>
  );
}
export default PluginSlotWithCallbackOverride;
