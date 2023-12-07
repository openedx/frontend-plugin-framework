'use client';

import React, {
  useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from 'react-error-boundary';
import { logError } from '@edx/frontend-platform/logging';
import {
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';

import {
  dispatchMountedEvent, dispatchReadyEvent, dispatchUnmountedEvent, useHostEvent,
} from './data/hooks';
import { PLUGIN_RESIZE } from './data/constants';
import messages from './Plugins.messages';

// TODO: see example-plugin-app/src/PluginOne.jsx for example of customizing errorFallback
function errorFallbackDefault(intl) {
  return (
    <div>
      <h2>
        {intl.formatMessage(messages.unexpectedError)}
      </h2>
    </div>
  );
}

const Plugin = ({
  children, className, intl, style, ready, errorFallbackProp,
}) => {
  const [dimensions, setDimensions] = useState({
    width: null,
    height: null,
  });

  const finalStyle = useMemo(() => ({
    ...dimensions,
    ...style,
  }), [dimensions, style]);

  const errorFallback = errorFallbackProp || errorFallbackDefault;

  // Error logging function
  // Need to confirm: When an error is caught here, the logging will be sent to the child MFE's logging service
  const logErrorToService = (error, info) => {
    logError(error, { stack: info.componentStack });
  };

  useHostEvent(PLUGIN_RESIZE, ({ payload }) => {
    setDimensions({
      width: payload.width,
      height: payload.height,
    });
  });

  useEffect(() => {
    dispatchMountedEvent();

    return () => {
      dispatchUnmountedEvent();
    };
  }, []);

  useEffect(() => {
    if (ready) {
      dispatchReadyEvent();
    }
  }, [ready]);

  return (
    <div className={className} style={finalStyle}>
      <ErrorBoundary
        FallbackComponent={() => errorFallback(intl)}
        onError={logErrorToService}
      >
        {children}
      </ErrorBoundary>
    </div>
  );
};

export default injectIntl(Plugin);

Plugin.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  errorFallbackProp: PropTypes.func,
  intl: intlShape.isRequired,
  ready: PropTypes.bool,
  style: PropTypes.object, // eslint-disable-line
};

Plugin.defaultProps = {
  className: null,
  errorFallbackProp: null,
  style: {},
  ready: true,
};
