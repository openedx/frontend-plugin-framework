import React from 'react';

/**
 * Context which makes the list of all plugin changes (allPluginChanges) available to the <DirectSlot> components
 * below it in the React tree
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
  This is what the allSlotChanges configuration should look like when passed into DirectPluginContext
  {
    id: "allDirectPluginChanges",
    getDirectSlotChanges() {
      return {
        "main-nav": [
          // Hide the "Drafts" link, except for administrators:
          {
            op: DirectPluginChangeOperation.Wrap,
            widgetId: "drafts",
            wrapper: HideExceptForAdmin,
          },
          // Add a new login link:
          {
            op: DirectPluginChangeOperation.Insert,
            widget: { id: "login", priority: 50, content: {
                url: "/login", icon: "person-fill", label: <FormattedMessage defaultMessage="Login" />
            }},
          },
        ],
      };
    },
  };
 */

/**
  This is what a slotChanges configuration should include depending on the operation:
  slotChanges = [
    { op: DirectPluginOperation.Insert; widget: <DirectSlotWidget object> },
    { op: DirectPluginOperation.Hide; widgetId: string },
    { op: DirectPluginOperation.Modify; widgetId: string, fn: (widget: <DirectSlotWidget>) => <DirectSlotWidget> },
    { op: DirectPluginOperation.Wrap; widgetId: string, wrapper: React.FC<{widget: React.ReactElement }> },
  ]
 */
