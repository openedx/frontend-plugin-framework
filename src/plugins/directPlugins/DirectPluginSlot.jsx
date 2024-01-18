import React from 'react';
import PropTypes from 'prop-types';

import { DirectPluginContext } from './DirectPlugin';
import organizePlugins from './utils';

const DirectPluginSlot = ({ defaultContents, slotId, renderWidget }) => {
  const allPluginChanges = React.useContext(DirectPluginContext);

  const preparedWidgets = React.useMemo(() => {
    const slotChanges = allPluginChanges.getDirectSlotChanges()[slotId] ?? [];
    return organizePlugins(defaultContents, slotChanges);
  }, [allPluginChanges, defaultContents, slotId]);

  return (
    <>
      {preparedWidgets.map((preppedWidget) => {
        if (preppedWidget.hidden) {
          return null;
        }
        if (preppedWidget.wrappers) {
          // TODO: define how the reduce logic is able to wrap widgets and make it testable
          // eslint-disable-next-line max-len
          return preppedWidget.wrappers.reduce((widget, wrapper) => React.createElement(wrapper, { widget, key: preppedWidget.id }), renderWidget(preppedWidget));
        }
        return renderWidget(preppedWidget);
      })}
    </>
  );
};

DirectPluginSlot.propTypes = {
  defaultContents: PropTypes.shape([]),
  slotId: PropTypes.string.isRequired,
  renderWidget: PropTypes.func.isRequired,
};

DirectPluginSlot.defaultProps = {
  defaultContents: [],
};

export default DirectPluginSlot;
