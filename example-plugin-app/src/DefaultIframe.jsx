/* eslint react/prop-types: off */

import React from 'react';
import { Plugin } from '@edx/frontend-plugin-framework';

function DefaultComponent() {
  return (
    <section className="bg-light p-3 h-100">
      <h3>Default iFrame Widget</h3>
      <p>
        This is a component that lives in the example-plugins-app and is provided in this host MFE via iFrame.
      </p>
    </section>
  );
}

function ErrorFallback(error) {
  return (
    <div className="text-center">
      <p className="h3 text-muted">
        Oops! An error occurred. Please refresh the screen to try again.
      </p>
      <br />
      {error.message}
    </div>
  );
}

export default function DefaultIframe() {
  return (
    <Plugin errorFallbackProp={ErrorFallback}>
      <DefaultComponent />
    </Plugin>
  );
}
