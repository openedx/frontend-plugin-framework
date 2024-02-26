import React from 'react';
import { PluginSlot } from '@edx/frontend-plugin-framework/plugins';

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
        <PluginSlot // TODO: update PluginSlot to reflect what it needs and how it fetches the config data
          id="example" // this is how PluginSlot knows which set of plugin URLs to grab from JS config
          className="d-flex flex-column"
          pluginProps={{
            className: 'flex-grow-1',
            title: 'example plugins',
          }}
          style={{
            height: 400,
          }}
        >
          <div key="default">This is default plugin content.</div>
        </PluginSlot>
      </div>
    </main>
  );
}
