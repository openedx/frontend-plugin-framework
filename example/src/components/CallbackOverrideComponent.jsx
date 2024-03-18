import React, { useCallback } from "react";
import { useRegisterPluginCallback } from "@edx/frontend-plugin-framework";

export default function CallbackOverrideComponent({ id }) {
  const [items, setItems] = React.useState([]);

  const addItem = useCallback(() => [...items, "Plugin click"], [items]);

  const pluginOnlyClick = () => setItems(addItem());

  useRegisterPluginCallback(id, "pluginOverride", (prev) => {
    const result = addItem();
    setItems(result);
    return [...prev, "Plugin click"];
  });

  return (
    <section className="bg-success p-3 text-light">
      <h3>Default Direct Widget</h3>
      <p>
        When you click the button for main with plugin, you can trigger the
        callback defined in the plugin. Below are the events getting triggered:
      </p>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <button onClick={pluginOnlyClick}>Plugin only click</button>
    </section>
  );
}
