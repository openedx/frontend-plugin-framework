import React from 'react';

import PluginSlotWithIFrames from './pluginSlots/PluginSlotWithIFrames';
import PluginSlotWithDirectPlugins from './pluginSlots/PluginSlotWithDirectPlugins';
import PluginSlotWithMixedPlugins from './pluginSlots/PluginSlotWithMixedPlugins.jsx';

export default function ExamplePage() {
  return (
    <main>
      <h1>Plugins Page</h1>

      <p>
        This page is here to help test the plugins module.  A plugin configuration can be added in
        index.jsx and this page will display that plugin.
      </p>
      <p>
        To do this, a plugin MFE must be running on some other port.
        To make it a more realistic test, you may also want to edit your
        /etc/hosts file (or your system&apos;s equivalent) to provide an alternate domain for
        127.0.0.1 at which you can load the plugin.
      </p>
      <div className="d-flex flex-column">
        <PluginSlotWithIFrames />
        <PluginSlotWithDirectPlugins />
        <PluginSlotWithMixedPlugins />
      </div>
    </main>
  );
}
