/* eslint-disable import/no-extraneous-dependencies */
/* eslint react/prop-types: off */

import React from 'react';
import { render } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

import { initializeMockApp } from '@edx/frontend-platform/testing';
import {
  FormattedMessage,
  IntlProvider,
} from '@edx/frontend-platform/i18n';

import PluginContainer from './PluginContainer';
import Plugin from './Plugin';
import {
  IFRAME_PLUGIN, PLUGIN_MOUNTED, PLUGIN_READY, PLUGIN_RESIZE,
} from './data/constants';
import { IFRAME_FEATURE_POLICY } from './PluginContainerIframe';

const iframeConfig = {
  url: 'http://localhost/plugin1',
  type: IFRAME_PLUGIN,
};

// Mock ResizeObserver which is unavailable in the context of a test.
global.ResizeObserver = jest.fn(function mockResizeObserver() {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
});

describe('PluginContainer', () => {
  it('should return a blank page with a null plugin configuration', () => {
    // the URL will be empty and an empty div tag will exist where the iFrame should be
    // the iFrame will still take up the space assigned by the host MFE
    const component = (
      <PluginContainer config={null} />
    );

    const { container } = render(component);
    expect(container.firstChild).toBeNull();
  });

  it('should render a Plugin iFrame Container when given an iFrame config', async () => {
    const title = 'test plugin';
    const component = (
      <PluginContainer config={iframeConfig} title={title} fallback={<div>Loading</div>} />
    );

    const { container } = render(component);

    const iframeElement = container.querySelector('iframe');
    const fallbackElement = container.querySelector('div');

    expect(iframeElement).toBeInTheDocument();
    expect(fallbackElement).toBeInTheDocument();

    expect(fallbackElement.innerHTML).toEqual('Loading');

    // Ensure the iframe has the proper attributes
    expect(iframeElement.attributes.getNamedItem('allow').value).toEqual(IFRAME_FEATURE_POLICY);
    expect(iframeElement.attributes.getNamedItem('src').value).toEqual(iframeConfig.url);
    expect(iframeElement.attributes.getNamedItem('scrolling').value).toEqual('auto');
    expect(iframeElement.attributes.getNamedItem('title').value).toEqual(title);
    // The component isn't ready, since the class has 'd-none'
    expect(iframeElement.attributes.getNamedItem('class').value).toEqual('border border-0 w-100 d-none');

    jest.spyOn(iframeElement.contentWindow, 'postMessage');

    expect(iframeElement.contentWindow.postMessage).not.toHaveBeenCalled();

    // Dispatch a 'mounted' event manually.
    const mountedEvent = new Event('message');
    mountedEvent.data = {
      type: PLUGIN_MOUNTED,
    };
    mountedEvent.source = iframeElement.contentWindow;
    fireEvent(window, mountedEvent);

    expect(iframeElement.contentWindow.postMessage).toHaveBeenCalledWith(
      {
        type: PLUGIN_RESIZE,
        payload: {
          width: 0, // There's no width/height here in jsdom-land.
          height: 0,
        },
      },
      'http://localhost/plugin1',
    );

    // Dispatch a 'ready' event manually.
    const readyEvent = new Event('message');
    readyEvent.data = {
      type: PLUGIN_READY,
    };
    readyEvent.source = iframeElement.contentWindow;
    fireEvent(window, readyEvent);

    expect(iframeElement.attributes.getNamedItem('class').value).toEqual('border border-0 w-100');
  });
});

describe('Plugin', () => {
  let logError = jest.fn();

  const error = (
    <FormattedMessage
      id="raised.error.message.text"
      defaultMessage="there is an error in the React component"
      description="raised error message when an error occurs in React component"
    />
  );

  beforeEach(async () => {
    // This is a gross hack to suppress error logs in the invalid parentSelector test
    jest.spyOn(console, 'error');
    global.console.error.mockImplementation(() => {});

    const { loggingService } = initializeMockApp();
    logError = loggingService.logError;
  });

  afterEach(() => {
    global.console.error.mockRestore();
    jest.clearAllMocks();
  });

  const PluginPageWrapper = ({
    params, ErrorFallbackComponent, ChildComponent,
  }) => (
    <IntlProvider locale="en">
      <Plugin params={params} ErrorFallbackComponent={ErrorFallbackComponent}>
        <ChildComponent />
      </Plugin>
    </IntlProvider>
  );

  const ExplodingComponent = () => {
    throw new Error(error);
  };

  const HealthyComponent = () => (
    <div>
      <FormattedMessage
        id="hello.world.message.text"
        defaultMessage="Hello World!"
        description="greeting the world with a hello"
      />
    </div>
  );

  const ErrorFallbackComponent = () => (
    <div>
      <p>
        <FormattedMessage
          id="unexpected.error.message.text"
          defaultMessage="Oh geez, this is not good at all."
          description="error message when an unexpected error occurs"
        />
      </p>
      <br />
    </div>
  );

  it('should render children if no error', () => {
    const component = (
      <PluginPageWrapper
        ErrorFallbackComponent={ErrorFallbackComponent}
        ChildComponent={HealthyComponent}
      />
    );
    const { container } = render(component);
    expect(container).toHaveTextContent('Hello World!');
  });

  it('should throw an error if the child component fails', () => {
    const component = (
      <PluginPageWrapper
        className="bg-light"
        ErrorFallbackComponent={ErrorFallbackComponent}
        ChildComponent={ExplodingComponent}
      />
    );

    render(component);

    expect(logError).toHaveBeenCalledTimes(1);
    expect(logError).toHaveBeenCalledWith(
      new Error(error),
      expect.objectContaining({
        stack: expect.stringContaining('ExplodingComponent'),
      }),
    );
  });

  it('should render the passed in fallback component when the error boundary receives a React error', () => {
    const component = (
      <PluginPageWrapper
        ErrorFallbackComponent={ErrorFallbackComponent}
        ChildComponent={ExplodingComponent}
      />
    );

    const { container } = render(component);
    expect(container).toHaveTextContent('Oh geez');
  });

  it('should render the default fallback component when one is not passed into the Plugin', () => {
    const component = (
      <PluginPageWrapper
        ChildComponent={ExplodingComponent}
      />
    );

    const { container } = render(component);
    expect(container).toHaveTextContent('Oops! An error occurred.');
  });
});
