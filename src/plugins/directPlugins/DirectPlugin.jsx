import React from 'react';

/**
 * Context which makes the list of enabled plugins available to the <DirectSlot> components below it in the React tree
 */
export const DirectPluginContext = React.createContext([]);

/**
 * @description DirectPluginOperation defines the changes to be made to either the default widget(s) or to any
 * that are inserted
 * @property {string} Insert - inserts a new widget into the DirectPluginSlot
 * @property {string} Hide - used to hide a default widget based on the widgetId
 * @property {string} Modify - used to modify/replace a widget's content
 * @property {string} Wrap - wraps a widget with a React element or fragment
 *
 */

export const DirectPluginOperations = {
  Insert: 'insert',
  Hide: 'hide',
  Modify: 'modify',
  Wrap: 'wrap',
};

/**
 * A placeholder for what the pluginChanges configuration should include depending on the operation:
 * pluginChanges = [
 * { op: DirectPluginOperation.Insert; widget: <DirectSlotWidget object> }
 * { op: DirectPluginOperation.Hide; widgetId: string }
 * { op: DirectPluginOperation.Modify; widgetId: string, fn: (widget: <DirectSlotWidget>) => <DirectSlotWidget> }
 * { op: DirectPluginOperation.Wrap; widgetId: string, wrapper: React.FC<{widget: React.ReactElement }> };
 * ]
 */
