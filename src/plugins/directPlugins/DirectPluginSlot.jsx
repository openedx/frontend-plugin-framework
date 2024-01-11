import React from 'react';
import PropTypes from 'prop-types';

import { DirectPluginContext } from './DirectPlugin';
import organizePlugins from './utils';

const DirectPluginSlot = ({ defaultContents, slotId, renderWidget }) => {
  const allPluginChanges = React.useContext(DirectPluginContext);

  const contents = React.useMemo(() => {
    const slotChanges = allPluginChanges.getDirectSlotChanges()[slotId] ?? [];
    return organizePlugins(defaultContents, slotChanges);
  }, [allPluginChanges, defaultContents, slotId]);

  return (
    <>
      {contents.map((c) => {
        if (c.hidden) {
          return null;
        }
        if (c.wrappers) {
          // TODO: define how the reduce logic is able to wrap widgets and make it testable
          // eslint-disable-next-line max-len
          return c.wrappers.reduce((widget, wrapper) => React.createElement(wrapper, { widget, key: c.id }), renderWidget(c));
        }
        return renderWidget(c);
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

export default { DirectPluginSlot };
