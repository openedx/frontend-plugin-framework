/* eslint-disable react/prop-types */

import React from 'react';
import '@testing-library/jest-dom';
import { render, fireEvent } from '@testing-library/react';
import { logError } from '@edx/frontend-platform/logging';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import PluginSlot from './PluginSlot';
import { usePluginSlot } from './data/hooks';

const iframePluginConfig = {
  op: 'insert',
  widget: {
    id: 'iframe_config',
    url: 'http://localhost/plugin1',
    type: 'IFRAME_PLUGIN',
    title: 'test iframe plugin',
    priority: 1,
  },
};

const defaultSlotConfig = {
  plugins: [
    iframePluginConfig,
  ],
  keepDefault: true,
};

jest.mock('./data/hooks', () => ({
  ...jest.requireActual('./data/hooks'),
  usePluginSlot: jest.fn(),
}));

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  Suspense: ({ children }) => children,
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

// Mock ResizeObserver which is unavailable in the context of a test.
global.ResizeObserver = jest.fn(function mockResizeObserver() {
  this.observe = jest.fn();
  this.disconnect = jest.fn();
});

// TODO: APER-3119 — Write unit tests for plugin scenarios not already tested for https://2u-internal.atlassian.net/browse/APER-3119
const content = { text: 'This is a widget.' };
const TestPluginSlot = (
  <IntlProvider locale="en">
    <PluginSlot
      id="test-slot"
      data-testid="test-slot-id"
      as="div"
    >
      <div data-testid="default_contents">
        {content.text}
      </div>
    </PluginSlot>
  </IntlProvider>
);

describe('PluginSlot', () => {
  beforeEach(() => {
    usePluginSlot.mockReturnValue(defaultSlotConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render multiple types of Plugin in a single slot config', () => {
    const { container, getByTestId } = render(TestPluginSlot);
    const iframeElement = container.querySelector('iframe');
    const defaultContent = getByTestId('default_contents');
    const pluginSlot = getByTestId('test-slot-id');

    expect(pluginSlot).toContainElement(iframeElement);
    expect(pluginSlot).toContainElement(defaultContent);
  });

  it('should order each Plugin by priority', () => {
    const { container, getByTestId } = render(TestPluginSlot);
    const iframeElement = container.querySelector('iframe');
    const defaultContent = getByTestId('default_contents');
    const pluginSlot = getByTestId('test-slot-id');

    // Dispatch a 'ready' event manually.
    const readyEvent = new Event('message');
    readyEvent.data = {
      type: 'PLUGIN_READY',
    };
    readyEvent.source = iframeElement.contentWindow;
    fireEvent(window, readyEvent);

    expect(pluginSlot.children[0]).toEqual(iframeElement);
    expect(pluginSlot.children[1]).toEqual(defaultContent);
  });

  it('should wrap a Plugin when using the "wrap" operation', () => {
    usePluginSlot.mockReturnValueOnce({
      plugins: [
        {
          op: 'wrap',
          widgetId: 'default_contents',
          wrapper: ({ component, idx }) => (
            <div key={idx} data-testid={`wrapper${idx + 1}`}>
              {component}
            </div>
          ),
        },
      ],
      keepDefault: true,
    });

    const { getByTestId } = render(TestPluginSlot);
    const wrapper1 = getByTestId('wrapper1');
    const defaultContent = getByTestId('default_contents');

    expect(wrapper1).toContainElement(defaultContent);
  });

  it('should not render a widget if the Hide operation is applied to it', () => {
    usePluginSlot.mockReturnValueOnce({
      plugins: [
        iframePluginConfig,
        {
          op: 'hide',
          widgetId: 'iframe_config',
        },
      ],
      keepDefault: true,
    });
    const { container } = render(TestPluginSlot);
    const iframeElement = container.querySelector('iframe');

    expect(iframeElement).toBeNull();
  });

  it('should throw an error for invalid config type', () => {
    usePluginSlot.mockReturnValueOnce({
      plugins: [
        {
          op: 'insert',
          widget: {
            id: 'invalid_config',
            type: 'INVALID_TYPE',
          },
        },
      ],
      keepDefault: true,
    });
    render(TestPluginSlot);

    expect(logError).toHaveBeenCalledWith('Config type INVALID_TYPE is not valid.');
  });
});
