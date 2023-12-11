/* eslint-disable no-nested-ternary */
// TODO: refactor nested ternaries in return statement

import React from 'react';
import PropTypes from 'prop-types';

// ///// Code for plugins ///////

export const UiChangeOperation = {
  Insert: 'insert',
  Hide: 'hide',
  Modify: 'modify',
  Wrap: 'wrap',
};

/**
 * Default "render" method for a <UiSlot>.
 * Assumes "content" is a React component and just renders it normally.
 */
export const defaultRender = (widget) => (
  <React.Fragment key={widget.id}>{widget.content}</React.Fragment>
);

export const DefaultUiSlot = (props) => (
  <UiSlot
    slotId={props.slotId}
    renderWidget={defaultRender}
    // eslint-disable-next-line react/jsx-no-useless-fragment
    defaultContents={props.children ? [{ id: 'content', priority: 50, content: <>{props.children}</> }] : []}
  />
);

DefaultUiSlot.propTypes = {
  slotId: PropTypes.string.isRequired,
  children: PropTypes.node,
};

DefaultUiSlot.defaultProps = {
  children: null,
};

/** Context which makes the list of enabled plugins available to the <UiSlot> components below it in the React tree */
export const UiPluginsContext = React.createContext([]);

export const UiSlot = ({ defaultContents, slotId, renderWidget }) => {
  const enabledPlugins = React.useContext(UiPluginsContext);
  const contents = React.useMemo(() => {
    const newContents = [...defaultContents];
    enabledPlugins.forEach(plugin => {
      const changes = plugin.getUiSlotChanges(); // Optional: Pass in any app-specific context that the plugin may want
      const slotChanges = changes[slotId] ?? [];

      // TODO: above could be condensed to:
      // const changes = plugin.getUiSlotChanges()[slotId] ?? [];
      // below slotChanges would be changed to changes
      slotChanges.forEach(change => {
        if (change.op === UiChangeOperation.Insert) {
          newContents.push(change.widget);
        } else if (change.op === UiChangeOperation.Hide) {
          const widget = newContents.find((w) => w.id === change.widgetId);
          if (widget) { widget.hidden = true; }
        } else if (change.op === UiChangeOperation.Modify) {
          const widgetIdx = newContents.findIndex((w) => w.id === change.widgetId);
          if (widgetIdx >= 0) {
            const widget = { ...newContents[widgetIdx] };
            newContents[widgetIdx] = change.fn(widget);
          }
        } else if (change.op === UiChangeOperation.Wrap) {
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
    });

    // for (const p of enabledPlugins) {
    //   const changes = p.getUiSlotChanges(); // Optional: Pass in any app-specific context that the plugin may want
    //   for (const change of (changes[slotId] ?? [])) {
    //     if (change.op === UiChangeOperation.Insert) {
    //       contents.push(change.widget);
    //     } else if (change.op === UiChangeOperation.Hide) {
    //       const widget = contents.find((w) => w.id === change.widgetId);
    //       if (widget) { widget.hidden = true; }
    //     } else if (change.op === UiChangeOperation.Modify) {
    //       const widgetIdx = contents.findIndex((w) => w.id === change.widgetId);
    //       if (widgetIdx >= 0) {
    //         const widget = { ...contents[widgetIdx] };
    //         contents[widgetIdx] = change.fn(widget);
    //       }
    //     } else if (change.op === UiChangeOperation.Wrap) {
    //       const widgetIdx = contents.findIndex((w) => w.id === change.widgetId);
    //       if (widgetIdx >= 0) {
    //         const newWidget = { wrappers: [], ...contents[widgetIdx] };
    // //refactor suggestion: remove bottom line and write wrappers: [change.wrapper]
    //         newWidget.wrappers.push(change.wrapper);
    //         contents[widgetIdx] = newWidget;
    //       }
    //     } else {
    //       throw new Error(`unknown plugin UI change operation: ${(change).op}`);
    //     }
    //   }
    // }
    // Sort first by priority, then by ID
    newContents.sort((a, b) => (a.priority - b.priority) * 10_000 + a.id.localeCompare(b.id));
    return newContents;
  }, [defaultContents, enabledPlugins, slotId]);

  return (
    <>
      {contents.map((c) => (c.hidden ? null
        : c.wrappers ? (
        // TODO: would be nice to understand how the below logic is able to wrap widgets
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
          c.wrappers.reduce((widget, wrapper) => React.createElement(wrapper, { widget, key: c.id }), renderWidget(c))
        )
          : renderWidget(c)))}
    </>
  );
};

UiSlot.propTypes = {
  defaultContents: PropTypes.shape([]),
  slotId: PropTypes.string.isRequired,
  renderWidget: PropTypes.func.isRequired,
};

UiSlot.defaultProps = {
  defaultContents: [],
};
