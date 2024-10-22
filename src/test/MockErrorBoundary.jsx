/** FOR TESTING PURPOSES ONLY */
/** This mock is used to mock the ErrorBoundary component to avoid having to deal with <ErrorPage /> in testing */

import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { logError } from '@edx/frontend-platform/logging';

/**
 * Error boundary component used to log caught errors and display the error page.
 *
 * @memberof module:React
 * @extends {Component}
 */
class MockErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    logError(error, { stack: info.componentStack });
  }

  render() {
    if (this.state.hasError) {
      // Render "Try again" instead of <Error Page /> from frontend-platform
      return this.props.fallbackComponent || <div>Try again</div>;
    }
    return this.props.children;
  }
}

MockErrorBoundary.propTypes = {
  children: PropTypes.node,
  fallbackComponent: PropTypes.node,
};

MockErrorBoundary.defaultProps = {
  children: null,
  fallbackComponent: undefined,
};

export default MockErrorBoundary;
