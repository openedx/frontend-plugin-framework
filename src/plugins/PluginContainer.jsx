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

function PluginContainer({
  config, slotOptions, slotErrorFallbackComponent, ...props
}) {
  if (!config) {
    return null;
  }

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

  // Retrieve a fallback component from JS config if one exists
  // Otherwise, use the fallback component specific to the PluginSlot if one exists
  // Otherwise, default to fallback from frontend-platform's ErrorBoundary
  const finalFallback = config.errorFallbackComponent || slotErrorFallbackComponent;

  return (
    <ErrorBoundary fallbackComponent={finalFallback}>
      {renderer}
    </ErrorBoundary>
  );
}

export default PluginContainer;

PluginContainer.propTypes = {
  /** Configuration for the Plugin in this container — i.e pluginSlot[id].example_plugin */
  config: PropTypes.shape(pluginConfigShape),
  /** Options passed to the PluginSlot */
  slotOptions: PropTypes.shape(slotOptionsShape),
  /** Error fallback component for the PluginSlot */
  slotErrorFallbackComponent: PropTypes.elementType,
};

PluginContainer.defaultProps = {
  config: null,
  slotOptions: {},
  slotErrorFallbackComponent: React.Fragment,
};
