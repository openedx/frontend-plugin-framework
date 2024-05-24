import React from 'react';
import { getConfig } from '@edx/frontend-platform';
import { logError } from '@edx/frontend-platform/logging';
import { PLUGIN_OPERATIONS, requiredPluginTypes } from './constants';

/**
 * Called by validatePlugin to compare plugin config to the required data and data types
 * @returns {Boolean} - returns true if all types are correct and present according to the plugin operation
 */
const validateRequirements = (requiredTypes, widgetConfig) => (Object.keys(requiredTypes).every(
  // eslint-disable-next-line valid-typeof
  (field) => (widgetConfig[field] && (typeof widgetConfig[field] === requiredTypes[field])),
));

/**
 * Called by organizePlugins to validate plugin configurations
 * @returns {Boolean} - boolean if all types are correct and present, else throws an error
 */
export const validatePlugin = (pluginConfig) => {
  let requiredTypes = {};
  // eslint-disable-next-line prefer-const
  let { op, ...config } = pluginConfig;
  if (!op) { logError('There is a config with an invalid PLUGIN_OPERATION. Check to make sure it is configured correctly.'); }

  if (op === PLUGIN_OPERATIONS.Insert) {
    config = config.widget;
    if (!config) { logError('insert operation config is missing widget object'); }

    requiredTypes = {
      ...requiredPluginTypes[op].base,
      ...requiredPluginTypes[op][config.type?.toLowerCase()],
    };
  } else {
    requiredTypes = requiredPluginTypes[op];
  }

  if (!validateRequirements(requiredTypes, config)) {
    logError(`the ${op} operation config is invalid for widget id: ${config.widgetId || config.id || 'MISSING ID'}`);
  }
  return true;
};

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
    validatePlugin(change);
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

export default {
  getConfigSlots,
  organizePlugins,
  validatePlugin,
  wrapComponent,
};
