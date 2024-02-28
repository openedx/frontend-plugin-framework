import React from 'react';

export default function DirectPluginTwo() {
  return (
    <main>
      <h3>Direct Plugin Two</h3>
      <p>
        This plugin is a component that lives in the example app and is directly inserted via JS configuration. 
        What makes this unique is that it isn't part of the default content defined for this slot, but is instead
        inserted as a "plugin slot change".
      </p>
    </main>
  );
}