import React, { forwardRef } from 'react';
import classNames from 'classnames';
import { Spinner } from '@openedx/paragon';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';

import messages from './Plugin.messages';
import { usePluginSlot } from './data/hooks';
import PluginContainer from './PluginContainer';
import { mergeRenderWidgetPropsWithPluginContent, organizePlugins, wrapComponent } from './data/utils';
import { slotOptionsShape } from './data/shapes';

function BasePluginSlot({
  as = React.Fragment,
  children = null,
  id,
  idAliases = [],
  pluginProps = {},
  slotOptions = {},
  slotErrorFallbackComponent,
  ...props
}, ref) {
  /** the plugins below are obtained by the id passed into PluginSlot by the Host MFE. See example/src/PluginsPage.jsx
  for an example of how PluginSlot is populated, and example/src/index.jsx for a dummy JS config that holds all plugins
  */

  const { keepDefault, plugins } = usePluginSlot(id, idAliases);
  const { formatMessage } = useIntl();

  const defaultContents = React.useMemo(() => {
    if (!keepDefault) {
      return [];
    }
    return ([{
      id: 'default_contents',
      priority: 50,
      RenderWidget: children,
    }]);
  }, [children, keepDefault]);

  const finalPlugins = React.useMemo(() => organizePlugins(defaultContents, plugins), [defaultContents, plugins]);

  // TODO: Unique plugin props
  // https://github.com/openedx/frontend-plugin-framework/issues/72
  const { loadingFallback } = pluginProps;

  const defaultLoadingFallback = (
    <div className={classNames(pluginProps.className, 'd-flex justify-content-center align-items-center')}>
      <Spinner animation="border" screenReaderText={formatMessage(messages.loading)} />
    </div>
  );

  const finalLoadingFallback = loadingFallback !== undefined
    ? loadingFallback
    : defaultLoadingFallback;

  const finalChildren = [];
  if (finalPlugins.length > 0) {
    finalPlugins.forEach((pluginConfig) => {
      // If hidden, don't push to finalChildren
      if (!pluginConfig.hidden) {
        let container;
        // If default content, render children (merging any custom defined props from
        // pluginConfig.content with any existing props on `RenderWidget`).
        if (pluginConfig.id === 'default_contents') {
          const propsForRenderWidget = (pluginConfig.RenderWidget && React.isValidElement(pluginConfig.RenderWidget))
            ? pluginConfig.RenderWidget.props
            : {};
          const updatedPropsForRenderWidget = mergeRenderWidgetPropsWithPluginContent({
            pluginSlotOptions: slotOptions,
            pluginConfig,
            pluginProps,
            renderWidgetProps: propsForRenderWidget,
          });
          container = React.isValidElement(pluginConfig.RenderWidget)
            ? React.cloneElement(pluginConfig.RenderWidget, { ...updatedPropsForRenderWidget, key: pluginConfig.id })
            : pluginConfig.RenderWidget;
        } else {
          container = (
            <PluginContainer
              key={pluginConfig.id}
              config={pluginConfig}
              loadingFallback={finalLoadingFallback}
              slotErrorFallbackComponent={slotErrorFallbackComponent}
              slotOptions={slotOptions}
              {...pluginProps}
            />
          );
        }
        // If wrappers are provided, wrap the Plugin
        if (pluginConfig.wrappers) {
          finalChildren.push(
            wrapComponent(
              () => container,
              pluginConfig.wrappers,
            ),
          );
        } else {
          finalChildren.push(container);
        }
      }
    });
  }

  return React.createElement(
    as,
    {
      ...props,
      ref,
    },
    finalChildren,
  );
}

BasePluginSlot.propTypes = {
  /** Element type for the PluginSlot wrapper component */
  as: PropTypes.elementType,
  /** Default children for the PluginSlot */
  children: PropTypes.node,
  /** ID of the PluginSlot configuration */
  id: PropTypes.string.isRequired,
  /** Aliases (additional IDs for the PluginSlot) */
  idAliases: PropTypes.arrayOf(PropTypes.string),
  /** Props that are passed down to each Plugin in the Slot */
  pluginProps: PropTypes.shape(),
  /** Options passed to the PluginSlot */
  slotOptions: PropTypes.shape(slotOptionsShape),
  /** Error fallback component to use for each plugin */
  slotErrorFallbackComponent: PropTypes.node,
};

const PluginSlot = forwardRef(BasePluginSlot);
PluginSlot.displayName = 'PluginSlot';

export default PluginSlot;
