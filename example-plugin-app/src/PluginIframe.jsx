import React from 'react';
import { Plugin } from '@openedx/frontend-plugin-framework';

export default function PluginIframe() {
  return (
    <Plugin>
      <section className="bg-light p-3 h-100">
        <h3>Inserted iFrame Plugin</h3>
        <p>
          This is a component that lives in the example-plugins-app and is provided in this host MFE via iFrame plugin.
        </p>
      </section>
    </Plugin>
  );
}
