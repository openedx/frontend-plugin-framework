import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { PLUGIN_OPERATIONS } from './constants';

/**
 * Called by PluginSlot to prepare the plugin changes for the given slot
 *
 * @param {Array} defaultContents - The default widgets where the plugin slot exists.
 * @param {Array} plugins - All of the changes assigned to the specific plugin slot
 * @returns {Array} - A sorted list of widgets with any additional properties needed to render them in the plugin slot
 */
export const organizePlugins = (defaultContents, plugins) => {
  const newContents = [...defaultContents];

  plugins.forEach(change => {
    if (change.op === PLUGIN_OPERATIONS.Insert) {
      newContents.push(change.widget);
    } else if (change.op === PLUGIN_OPERATIONS.Hide) {
      const widget = newContents.find((w) => w.id === change.widgetId);
      if (widget) { widget.hidden = true; }
    } else if (change.op === PLUGIN_OPERATIONS.Modify) {
      const widgetIdx = newContents.findIndex((w) => w.id === change.widgetId);
      if (widgetIdx >= 0) {
        const widget = { ...newContents[widgetIdx] };
        newContents[widgetIdx] = change.fn(widget);
      }
    } else if (change.op === PLUGIN_OPERATIONS.Wrap) {
      const widgetIdx = newContents.findIndex((w) => w.id === change.widgetId);
      if (widgetIdx >= 0) {
        const newWidget = { wrappers: [], ...newContents[widgetIdx] };
        newWidget.wrappers.push(change.wrapper);
        newContents[widgetIdx] = newWidget;
      }
    } else {
      throw new Error('unknown plugin change operation');
    }
  });

  newContents.sort((a, b) => (a.priority - b.priority) * 10_000 + a.id.localeCompare(b.id));
  return newContents;
};

/** Wraps the plugin component with number of wrappers provided.
 *
 * @param {Function} renderComponent - Function that returns JSX (i.e. React Component)
 * @param {Array} wrappers - Array of components that each use a "component" prop to render the wrapped contents
 * @returns {React.ReactElement} - The plugin component wrapped by any number of wrappers provided.
*/
export const wrapComponent = (renderComponent, wrappers) => wrappers.reduce(
  // Disabled lint because currently we don't have a unique identifier for this
  // The "component" and "wrapper" are both functions
  // eslint-disable-next-line react/no-array-index-key
  (component, wrapper, idx) => React.createElement(wrapper, { component, idx }),
  renderComponent(),
);

/**
 * Called by usePluginSlot to retrieve the most up-to-date Config Document*
 * @returns {Object} - The pluginSlots object in Config Document
 */
export const getConfigSlots = () => getConfig()?.pluginSlots;

// TODO: validating plugin operations. likely use combination of Object.keys to check each key and typeof to check each property's type
// consider: storing config shapes in shapes.js, writing a util function validatePlugin that gets called for each operation here
// write tests for validatePlugin
// on error, validatePlugin throws typeError with message of plugin id

/* Insert must include the following configuration
  widget: {
    id: 'new_plugin',
    priority: 10,
    type: DIRECT_PLUGIN,
    RenderWidget: SomeComponent
  }

  widget: {
    id: 'iframe_plugin',
    priority: 10,
    type: IFRAME_PLUGIN
    title: 'iframe plugin',
    url: 'example.url.com'
  }

  widget: {
    id: 'inserted_plugin',
    type: DIRECT_PLUGIN,
    priority: 10,
    RenderWidget: ModularComponent,
    content: {
      title: 'Modular Direct Plugin',
      uniqueText: 'This is some text that will be replaced by the Modify operation below.',
    },
  },
*/

/* Hide must include the following configuration
  widgetId,
*/

/* Modify must include the following configuration
  widgetId,
  fn
*/

/* must include the following configuration
  widget: {
    id: 'new_plugin',
    priority: 10,
    type: DIRECT_PLUGIN,
    RenderWidget: SomeComponent
  }
*/

export const validatePlugin = ({ op, widget }) => {
  if (op === PLUGIN_OPERATIONS.Insert) {
    const requiredFields = ['id', 'priority', 'type'];
    const requiredTypes = {
      id: 'string',
      priority: 'number',
      type: 'string',
      RenderWidget: 'function',
      title: 'string',
      url: 'string',
      content: 'object',
    };

    const isValidField = requiredFields.every((field) => Object.keys(widget).includes(field));
    const isValidTypes = Object.keys(widget).every((key) => typeof widget[key] === requiredTypes[key]);
    return isValidField && isValidTypes;
  }
}
export default {
  getConfigSlots,
  organizePlugins,
  validatePlugin,
  wrapComponent,
};
