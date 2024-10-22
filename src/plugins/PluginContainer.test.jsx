/* eslint-disable react/prop-types */
import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import PluginContainer from './PluginContainer';
import { IFRAME_PLUGIN, DIRECT_PLUGIN } from './data/constants';
import PluginContainerDirect from './PluginContainerDirect';
import MockErrorBoundary from '../test/MockErrorBoundary';

jest.mock('./PluginContainerIframe', () => jest.fn(() => 'Iframe plugin'));

jest.mock('./PluginContainerDirect', () => jest.fn(() => 'Direct plugin'));

jest.mock('@edx/frontend-platform/react', () => ({
  ...jest.requireActual,
  ErrorBoundary: (props) => <MockErrorBoundary {...props} />,
}));

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockConfig = {
  id: 'test-plugin-container',
  errorFallbackComponent: undefined,
};

function PluginContainerWrapper({ type = DIRECT_PLUGIN, config = mockConfig, slotErrorFallbackComponent }) {
  return (
    <IntlProvider locale="en">
      <PluginContainer
        config={{ type, ...config }}
        slotErrorFallbackComponent={slotErrorFallbackComponent}
      />
    </IntlProvider>
  );
}

describe('PluginContainer', () => {
  it('renders a PluginContainerIframe when passed the IFRAME_PLUGIN type in the configuration', () => {
    const { getByText } = render(<PluginContainerWrapper type={IFRAME_PLUGIN} />);

    expect(getByText('Iframe plugin')).toBeInTheDocument();
  });

  it('renders a PluginContainerDirect when passed the DIRECT_PLUGIN type in the configuration', () => {
    const { getByText } = render(<PluginContainerWrapper type={DIRECT_PLUGIN} />);

    expect(getByText('Direct plugin')).toBeInTheDocument();
  });

  describe('ErrorBoundary', () => {
    beforeAll(() => {
      const ExplodingComponent = () => {
        throw new Error('an error occurred');
      };
      PluginContainerDirect.mockReturnValue(<ExplodingComponent />);
    });
    it('renders fallback component from JS config if one exists', () => {
      function CustomFallbackFromJSConfig() {
        return (
          <div>
            JS config fallback
          </div>
        );
      }

      const { getByText } = render(
        <PluginContainerWrapper
          config={{
            ...mockConfig,
            errorFallbackComponent: <CustomFallbackFromJSConfig />,
          }}
        />,
      );
      expect(getByText('JS config fallback')).toBeInTheDocument();
    });

    it('renders fallback component from PluginSlot props if one exists', () => {
      function CustomFallbackFromPluginSlot() {
        return (
          <div>
            PluginSlot props fallback
          </div>
        );
      }

      const { getByText } = render(
        <PluginContainerWrapper
          slotErrorFallbackComponent={<CustomFallbackFromPluginSlot />}
        />,
      );
      expect(getByText('PluginSlot props fallback')).toBeInTheDocument();
    });

    it('renders default fallback <ErrorPage /> when there is no fallback set in configuration', () => {
      const { getByText } = render(<PluginContainerWrapper />);
      expect(getByText('Try again')).toBeInTheDocument();
    });
  });
});
