'use client';

import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import PluginContainerIframe from './PluginContainerIframe';

import {
  IFRAME_PLUGIN,
} from './data/constants';
import { pluginConfigShape } from './data/shapes';

const PluginContainer = ({ config, ...props }) => {
  if (config === null) {
    return null;
  }

  // this will allow for future plugin types to be inserted in the PluginErrorBoundary
  switch (config.type) {
    case IFRAME_PLUGIN:
      return (
        <PluginContainerIframe config={config} {...props} />
      );
    default:
      return null;
  }
};

export default PluginContainer;

PluginContainer.propTypes = {
  /** Configuration for the Plugin in this container — i.e pluginSlot[id].example_plugin */
  config: pluginConfigShape,
};

PluginContainer.defaultProps = {
  config: null,
};
