import React from 'react';

/** Context which makes the list of enabled plugins available to the <UiSlot> components below it in the React tree */
export const DirectPluginsContext = React.createContext([]);

// DirectPluginOperation

export const DirectPluginOperations = {
  Insert: 'insert',
  Hide: 'hide',
  Modify: 'modify',
  Wrap: 'wrap',
};

/**
it makes sense to have the definitions of ChangeOperation live in here, but the actual changes are tightly living in
pluginslot because of the newContents array that is being changed. Ideally, the PluginSlot itself doesn't care about
the plugins inside it, it only cares about returning some component with the empty React tags <>

export type DirectPluginOperation =
  | { op: DirectPluginOperation.Insert; widget: UISlotWidget<unknown> }
  | { op: DirectPluginOperation.Hide; widgetId: string }
  | { op: DirectPluginOperation.Modify; widgetId: string, fn: (widget: UISlotWidget<unknown>) => UISlotWidget<unknown> }
  | { op: DirectPluginOperation.Wrap; widgetId: string, wrapper: React.FC<{widget: React.ReactElement}> };

*/

// idea: move enabledPlugins and all of the logic that contents receives into DirectPlugin.jsx
// this will mean that all of the logic for changing plugins will live in there.
// all that pluginSlot cares about is that if given contents then it will render it accordingly.

// also consider maybe moving defaultContents into the same config as the plugin operations object.
// This will maybe bring it closer to the scenario where the defaultContents is just part of the config object
// alongside the plugin changes. Like, why would want to separate those two objects from each other when they're
// part of the same flow.
