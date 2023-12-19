'use client';

import React, {
  useEffect, useMemo, useState,
} from 'react';
import PropTypes from 'prop-types';
import { ErrorBoundary } from '@edx/frontend-platform/react';
import {
  injectIntl,
  intlShape,
} from '@edx/frontend-platform/i18n';

import {
  dispatchMountedEvent, dispatchReadyEvent, dispatchUnmountedEvent, useHostEvent,
} from './data/hooks';
import { PLUGIN_RESIZE } from './data/constants';
import messages from './Plugins.messages';

// TODO: create example-plugin-app/src/PluginOne.jsx for example of customizing errorFallback
const ErrorFallbackDefault = ({ intl }) => (
  <div>
    <h2>
      {intl.formatMessage(messages.unexpectedError)}
    </h2>
  </div>
);

// TODO: find out where "ready" comes from
const Plugin = ({
  children, className, intl, style, ready, ErrorFallbackComponent,
}) => {
  const [dimensions, setDimensions] = useState({
    width: null,
    height: null,
  });

  const finalStyle = useMemo(() => ({
    ...dimensions,
    ...style,
  }), [dimensions, style]);

  // Need to confirm: When an error is caught here, the logging will be sent to the child MFE's logging service

  const ErrorFallback = ErrorFallbackComponent || ErrorFallbackDefault;

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
    // TODO: find out where "ready" comes from and when it would be true
    if (ready) {
      dispatchReadyEvent();
    }
  }, [ready]);

  return (
    <div className={className} style={finalStyle}>
      <ErrorBoundary
      // Must be React Component format (<ComponentName ...props />) or it won't render
      // TODO: update frontend-platform code to refactor <ErrorBoundary /> or include info in docs somewhere
        fallbackComponent={<ErrorFallback intl={intl} />}
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
  ErrorFallbackComponent: PropTypes.func,
  intl: intlShape.isRequired,
  ready: PropTypes.bool,
  style: PropTypes.object, // eslint-disable-line
};

Plugin.defaultProps = {
  className: null,
  ErrorFallbackComponent: null,
  style: {},
  ready: true,
};

ErrorFallbackDefault.propTypes = {
  intl: intlShape.isRequired,
};
