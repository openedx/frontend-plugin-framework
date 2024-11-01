/* eslint-disable react/prop-types */

import React from 'react';
import '@testing-library/jest-dom';
import classNames from 'classnames';
import { render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { logError } from '@edx/frontend-platform/logging';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import PluginSlot from './PluginSlot';
import { usePluginSlot } from './data/hooks';
import { PLUGIN_OPERATIONS } from './data/constants';

const iframePluginConfig = {
  op: PLUGIN_OPERATIONS.Insert,
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

// Mock callback functions
const pluginContentOnClick = jest.fn();
const defaultContentsOnClick = jest.fn();
const mockOnClick = jest.fn();

// TODO: https://github.com/openedx/frontend-plugin-framework/issues/73

const content = { text: 'This is a widget.' };
function DefaultContents({ className, onClick, ...rest }) {
  const handleOnClick = (e) => {
    defaultContentsOnClick(e);
    onClick?.(e);
  };

  return (
    <div
      {...rest}
      data-testid="default_contents"
      className={classNames('default-classname', className)}
      onClick={handleOnClick}
      onKeyUp={handleOnClick}
      role="button"
      tabIndex={0}
    >
      {content.text}
    </div>
  );
}

function PluginSlotWrapper({ slotOptions, children }) {
  return (
    <IntlProvider locale="en">
      <PluginSlot
        id="test-slot"
        data-testid="test-slot-id"
        as="div"
        slotOptions={slotOptions}
      >
        {children}
      </PluginSlot>
    </IntlProvider>
  );
}

function TestPluginSlot({
  hasDefaultContentsOnClick = false,
  hasChildren = true,
  hasChildrenElement = true,
  hasMultipleChildren = false,
  ...rest
}) {
  const defaultContentsProps = {
    className: 'other-classname',
    style: { background: 'gray' },
  };
  if (hasDefaultContentsOnClick) {
    defaultContentsProps.onClick = mockOnClick;
  }
  if (hasChildren && hasChildrenElement && hasMultipleChildren) {
    return (
      <PluginSlotWrapper {...rest}>
        <DefaultContents {...defaultContentsProps} />
        <DefaultContents {...defaultContentsProps} />
      </PluginSlotWrapper>
    );
  }
  if (hasChildren) {
    return (
      <PluginSlotWrapper {...rest}>
        {hasChildrenElement
          ? <DefaultContents {...defaultContentsProps} />
          : content.text}
      </PluginSlotWrapper>
    );
  }
  return <PluginSlotWrapper {...rest} />;
}

const defaultSlotOptions = {
  mergeProps: true,
};

function TestPluginSlotWithSlotOptions({ slotOptions: slotOptionsOverride, ...rest }) {
  const slotOptions = {
    ...defaultSlotOptions,
    ...slotOptionsOverride,
  };
  return <TestPluginSlot slotOptions={slotOptions} {...rest} />;
}

describe('PluginSlot', () => {
  beforeEach(() => {
    usePluginSlot.mockReturnValue(defaultSlotConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render multiple types of Plugin in a single slot config', () => {
    const { container, getByTestId } = render(<TestPluginSlot />);
    const iframeElement = container.querySelector('iframe');
    const defaultContent = getByTestId('default_contents');
    const pluginSlot = getByTestId('test-slot-id');

    expect(pluginSlot).toContainElement(iframeElement);
    expect(pluginSlot).toContainElement(defaultContent);
  });

  it('should order each Plugin by priority', () => {
    const { container, getByTestId } = render(<TestPluginSlot />);
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
          op: PLUGIN_OPERATIONS.Wrap,
          widgetId: 'default_contents',
          wrapper: ({ component }) => (
            <div data-testid="custom-wrapper">
              {component}
            </div>
          ),
        },
      ],
      keepDefault: true,
    });

    const { getByTestId } = render(<TestPluginSlot />);
    const customWrapper = getByTestId('custom-wrapper');
    const defaultContent = getByTestId('default_contents');
    expect(customWrapper).toContainElement(defaultContent);
  });

  it('should not render a widget if the Hide operation is applied to it', () => {
    usePluginSlot.mockReturnValueOnce({
      plugins: [
        iframePluginConfig,
        {
          op: PLUGIN_OPERATIONS.Hide,
          widgetId: 'iframe_config',
        },
      ],
      keepDefault: true,
    });
    const { container } = render(<TestPluginSlot />);
    const iframeElement = container.querySelector('iframe');

    expect(iframeElement).toBeNull();
  });

  it('should throw an error for invalid config type', () => {
    usePluginSlot.mockReturnValueOnce({
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'invalid_config',
            type: 'INVALID_TYPE',
          },
        },
      ],
      keepDefault: true,
    });
    render(<TestPluginSlot />);

    expect(logError).toHaveBeenCalledWith('the insert operation config is invalid for widget id: invalid_config');
  });

  it('should handle multiple children', () => {
    const { queryAllByTestId } = render(<TestPluginSlot hasMultipleChildren />);
    const defaultContentsWidgets = queryAllByTestId('default_contents');
    expect(defaultContentsWidgets).toHaveLength(2);
    defaultContentsWidgets.forEach((widget) => {
      expect(widget).toHaveTextContent(content.text);
    });
  });

  it('should handle empty children', () => {
    const { getByTestId } = render(<TestPluginSlot hasChildren={false} />);
    expect(getByTestId('test-slot-id')).toBeInTheDocument();
  });

  it('should handle keepDefault=false', () => {
    usePluginSlot.mockReturnValueOnce({
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'inserted_direct_plugin',
            type: 'DIRECT_PLUGIN',
            priority: 1,
            RenderWidget: () => <div data-testid="inserted_direct_plugin">Inserted Direct Plugin</div>,
          },
        },
      ],
      keepDefault: false,
    });
    const { container, queryByTestId, getByTestId } = render(<TestPluginSlot />);
    const defaultContent = queryByTestId('default_contents');

    expect(container).not.toContainElement(defaultContent);
    const insertedPlugin = getByTestId('inserted_direct_plugin');
    expect(container).toContainElement(insertedPlugin);
  });

  it.each([
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions />,
      hasPluginSlotChildElement: true,
      hasMockOnClick: false,
      pluginContent: { 'data-custom-attr': 'abc' },
      includedAttributes: ['data-custom-attr'],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions />,
      hasPluginSlotChildElement: true,
      hasMockOnClick: false,
      pluginContent: { 'data-custom-attr': '' },
      includedAttributes: ['data-custom-attr'],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions />,
      hasPluginSlotChildElement: true,
      hasMockOnClick: false,
      pluginContent: { 'data-custom-attr': undefined },
      includedAttributes: ['data-custom-attr'],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions />,
      hasPluginSlotChildElement: true,
      hasMockOnClick: false,
      pluginContent: { 'data-custom-attr': null },
      includedAttributes: ['data-custom-attr'],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions />,
      hasPluginSlotChildElement: true,
      hasMockOnClick: false,
      pluginContent: { className: 'test123' },
      includedAttributes: ['className'],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions />,
      hasPluginSlotChildElement: true,
      hasMockOnClick: false,
      pluginContent: { style: 'invalid' },
      includedAttributes: [],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions />,
      hasPluginSlotChildElement: true,
      hasMockOnClick: false,
      pluginContent: { style: { color: 'blue' } },
      includedAttributes: ['style'],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions hasDefaultContentsOnClick />,
      hasPluginSlotChildElement: true,
      hasMockOnClick: true,
      pluginContent: { onClick: pluginContentOnClick },
      includedAttributes: ['onClick'],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions />,
      hasPluginSlotChildElement: true,
      hasMockOnClick: false,
      pluginContent: { onClick: pluginContentOnClick },
      includedAttributes: ['onClick'],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions />,
      hasPluginSlotChildElement: true,
      hasMockOnClick: false,
      pluginContent: {},
      includedAttributes: [],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions />,
      hasPluginSlotChildElement: true,
      hasMockOnClick: false,
      pluginContent: undefined,
      includedAttributes: [],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions />,
      hasPluginSlotChildElement: true,
      hasMockOnClick: false,
      pluginContent: null,
      includedAttributes: [],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions hasChildrenElement={false} />,
      hasPluginSlotChildElement: false,
      hasMockOnClick: false,
      pluginContent: { 'data-custom-attr': 'abc' },
      includedAttributes: [],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions hasChildrenElement={false} />,
      hasPluginSlotChildElement: false,
      hasMockOnClick: false,
      pluginContent: {},
      includedAttributes: [],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions hasChildrenElement={false} />,
      hasPluginSlotChildElement: false,
      hasMockOnClick: false,
      pluginContent: null,
      includedAttributes: [],
    },
    {
      MockPluginSlot: <TestPluginSlotWithSlotOptions hasChildrenElement={false} />,
      hasPluginSlotChildElement: false,
      hasMockOnClick: false,
      pluginContent: undefined,
      includedAttributes: [],
    },
  ])('should handle the Modify operation for the default_contents widget with slotOptions.mergeProps=true (%s)', async ({
    MockPluginSlot,
    hasPluginSlotChildElement,
    hasMockOnClick,
    pluginContent,
    includedAttributes,
  }) => {
    usePluginSlot.mockReturnValueOnce({
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Modify,
          widgetId: 'default_contents',
          fn: (widget) => ({
            ...widget,
            content: pluginContent,
          }),
        },
      ],
      keepDefault: true,
    });
    const { queryByTestId, getByText } = render(MockPluginSlot);

    expect(getByText(content.text)).toBeInTheDocument();
    const defaultContents = queryByTestId('default_contents');

    if (hasPluginSlotChildElement) {
      expect(defaultContents).toBeInTheDocument();
      expect(defaultContents).toHaveClass('default-classname');
      expect(defaultContents).toHaveClass('other-classname');
      expect(defaultContents).toHaveStyle({ background: 'gray' });

      await userEvent.click(defaultContents);
      const expectedEventObject = expect.objectContaining({ type: 'click', target: expect.any(Element) });
      expect(defaultContentsOnClick).toHaveBeenCalledTimes(1);
      expect(defaultContentsOnClick).toHaveBeenCalledWith(expectedEventObject);
      if (hasMockOnClick) {
        expect(mockOnClick).toHaveBeenCalledTimes(1);
        expect(mockOnClick).toHaveBeenCalledWith(expectedEventObject);
      }

      if (!pluginContent) { return; }

      Object.entries(pluginContent).forEach(([key, value]) => {
        const expectedValue = !value ? '' : value;
        if (!includedAttributes.includes(key)) {
          if (key === 'style') {
            Object.entries(value).forEach(([styleProperty, styleValue]) => {
              const expectedStyle = {};
              expectedStyle[styleProperty] = styleValue;
              expect(defaultContents).not.toHaveStyle(expectedStyle);
            });
            return;
          }
          expect(defaultContents).not.toHaveAttribute(key);
          return;
        }

        if (key === 'className') {
          expect(defaultContents).toHaveClass(expectedValue);
          return;
        }

        if (key === 'style') {
          Object.entries(value).forEach(([styleProperty, styleValue]) => {
            const expectedStyle = {};
            expectedStyle[styleProperty] = styleValue;
            expect(defaultContents).toHaveStyle(expectedStyle);
          });
          return;
        }

        if (key === 'onClick') {
          expect(pluginContentOnClick).toHaveBeenCalledTimes(1);
          expect(pluginContentOnClick).toHaveBeenCalledWith(expectedEventObject);
          return;
        }

        expect(defaultContents).toHaveAttribute(key, expectedValue);
      });
    } else {
      expect(defaultContents).not.toBeInTheDocument();
    }
  });
});
