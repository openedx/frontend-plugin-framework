import React from 'react';
import { usePluginContext } from '@edx/frontend-plugin-framework';

export default function CallbackOverrideComponent({
  id
}) {
  const { registerPluginCallback } = usePluginContext();

  registerPluginCallback(id, 'pluginOverride', (prev) => {
    return prev.concat('Plugin override');
  });

  registerPluginCallback(id, 'pluginClickOnly', (prev) => {
    return ['Plugin only click'];
  });

  return (
    <section className="bg-success p-3 text-light">
      <h1>test</h1>
    </section>
  );
}
