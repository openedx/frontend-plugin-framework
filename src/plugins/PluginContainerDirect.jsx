import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

import { directPluginConfigShape, slotOptionsShape } from './data/shapes';
import { mergeRenderWidgetPropsWithPluginContent } from './data/utils';

function PluginContainerDirect({
  config, slotOptions, loadingFallback, ...props
}) {
  const { RenderWidget, id } = config;

  // When applicable, merge base RenderWidget props with custom plugin content, if any.
  const propsForRenderWidget = mergeRenderWidgetPropsWithPluginContent({
    pluginSlotOptions: slotOptions,
    pluginConfig: config,
    renderWidgetProps: props,
  });

  return (
    <Suspense fallback={loadingFallback}>
      <RenderWidget id={id} {...propsForRenderWidget} />
    </Suspense>
  );
}

PluginContainerDirect.propTypes = {
  /** Configuration for the Plugin in this container (i.e. pluginSlot[id].example_plugin) */
  config: PropTypes.shape(directPluginConfigShape).isRequired,
  /** Custom fallback component used when component is not ready (i.e. "loading") */
  loadingFallback: PropTypes.node,
  /** Options passed to the PluginSlot */
  slotOptions: PropTypes.shape(slotOptionsShape),
};

PluginContainerDirect.defaultProps = {
  loadingFallback: null,
  slotOptions: {},
};

export default PluginContainerDirect;
