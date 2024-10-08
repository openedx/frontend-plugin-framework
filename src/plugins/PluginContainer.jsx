'use client';

import React from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from '@edx/frontend-platform/react';

import PluginContainerIframe from './PluginContainerIframe';
import PluginContainerDirect from './PluginContainerDirect';

import {
  IFRAME_PLUGIN,
  DIRECT_PLUGIN,
} from './data/constants';
import { pluginConfigShape, slotOptionsShape } from './data/shapes';

function PluginContainer({ config, slotOptions, ...props }) {
  if (!config) {
    return null;
  }

	// TODO: start here and maybe have the ErrorBoundary at the Container level??
  // this will allow for future plugin types to be inserted in the PluginErrorBoundary
  let renderer = null;
  switch (config.type) {
    case IFRAME_PLUGIN:
      renderer = (
        <PluginContainerIframe
          config={config}
          {...props}
        />
      );
      break;
    case DIRECT_PLUGIN:
      renderer = (
        <PluginContainerDirect
          config={config}
          slotOptions={slotOptions}
          {...props}
        />
      );
      break;
    default:
      break;
  }

  return renderer;
}

export default PluginContainer;

PluginContainer.propTypes = {
  /** Configuration for the Plugin in this container — i.e pluginSlot[id].example_plugin */
  config: PropTypes.shape(pluginConfigShape),
  /** Options passed to the PluginSlot */
  slotOptions: PropTypes.shape(slotOptionsShape),
};

PluginContainer.defaultProps = {
  config: null,
  slotOptions: {},
};
