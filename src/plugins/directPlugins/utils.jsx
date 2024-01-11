import { DirectPluginOperations } from './DirectPlugin';

/**
 * Called by DirectPluginSlot to prepare the plugin changes for the given slot
 *
 * @param {Array} defaultContents - The default widgets where the plugin slot exists.
 * @param {Array} slotChanges - All of the changes assigned to the specific plugin slot
 * @returns {Array} - A sorted list of widgets with any additional properties needed to render them in the plugin slot
 */
const organizePlugins = (defaultContents, slotChanges) => {
  const newContents = [...defaultContents];

  slotChanges.forEach(change => {
    if (change.op === DirectPluginOperations.Insert) {
      newContents.push(change.widget);
    } else if (change.op === DirectPluginOperations.Hide) {
      const widget = newContents.find((w) => w.id === change.widgetId);
      if (widget) { widget.hidden = true; }
    } else if (change.op === DirectPluginOperations.Modify) {
      const widgetIdx = newContents.findIndex((w) => w.id === change.widgetId);
      if (widgetIdx >= 0) {
        const widget = { ...newContents[widgetIdx] };
        newContents[widgetIdx] = change.fn(widget);
      }
    } else if (change.op === DirectPluginOperations.Wrap) {
      const widgetIdx = newContents.findIndex((w) => w.id === change.widgetId);
      if (widgetIdx >= 0) {
        const newWidget = { wrappers: [], ...newContents[widgetIdx] };
        newWidget.wrappers.push(change.wrapper);
        newContents[widgetIdx] = newWidget;
      }
    } else {
      throw new Error('unknown direct plugin change operation');
    }
  });

  newContents.sort((a, b) => (a.priority - b.priority) * 10_000 + a.id.localeCompare(b.id));
  return newContents;
};

export default organizePlugins;
