import React from 'react';
// allows mocking state modules from
// eslint-disable-next-line import/no-self-import

import { DirectPluginOperations } from './DirectPlugin';

export const organizePlugins = (defaultContents, pluginChanges) => {
  const newContents = [...defaultContents];

  pluginChanges.forEach(change => {
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
        // refactor suggestion: remove bottom line and write wrappers: [change.wrapper]
        newWidget.wrappers.push(change.wrapper);
        newContents[widgetIdx] = newWidget;
      }
    } else {
      throw new Error(`unknown plugin UI change operation: ${(change).op}`);
    }
  });

  // newContents.sort((a, b) => (a.priority - b.priority) * 10_000 + a.id.localeCompare(b.id));
  return newContents;
};

export const useGetPlugins = (defaultContents, enabledPlugins) => {
  const contents = React.useMemo(() => {
    organizePlugins(defaultContents, enabledPlugins);
  }, [defaultContents, enabledPlugins]);
  return contents;
};

export default { useGetPlugins, organizePlugins };
