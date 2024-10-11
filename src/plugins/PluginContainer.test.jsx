/* eslint-disable react/prop-types */
import React from 'react';
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import PluginContainer from './PluginContainer';
import { IFRAME_PLUGIN, DIRECT_PLUGIN } from './data/constants';
import PluginContainerDirect from './PluginContainerDirect';

jest.mock('./PluginContainerIframe', () => jest.fn(() => 'Iframe plugin'));

jest.mock('./PluginContainerDirect', () => jest.fn(() => 'Direct plugin'));

// TODO: figure out how to mock <Error Page /> that is imported into the ErrorBoundary component
// This is causing issues with i18n when it tries to render
// Options:
// mock the whole ErrorBoundary component and have it return a mockErrorPage instead
// find if there is a way to mock the import from <Error Page /> that happens in <ErrorBoundary />

// Feels perhaps best to just mock the ErrorBoundary here in FPF
// IF this were an MFE, we could use the initializeMockApp helper function from frontend-platform
// since FPF is not an MFE, that mock won't work for us here

// There may be use cases in the future for testing this ErrorBoundary so perhaps there is value in mocking it here

// jest.mock('@edx/frontend-platform/react', () ({
//   ...jest.requireActual,
//   ErrorBoundary: ({children}) =>
// }))

jest.mock('@edx/frontend-platform/logging', () => ({
  logError: jest.fn(),
}));

const mockConfig = {
  id: 'test-plugin-container',
  errorFallbackComponent: undefined,
};

function PluginContainerWrapper({ type = DIRECT_PLUGIN, config = mockConfig, slotErrorFallbackComponent = false }) {
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
  // TODO: test for each error boundary
  // it renders from the JS config if it exists
  // it renders from the PluginSlot if it exists
  // it renders the default if no config or PluginSlot fallback are provided

  it('renders a PluginContainerIframe when passed IFRAME_PLUGIN in the configuration', () => {
    const { getByText } = render(<PluginContainerWrapper type={IFRAME_PLUGIN} />);

    expect(getByText('Iframe plugin')).toBeInTheDocument();
  });

  it('renders a PluginContainerDirect when passed DIRECT_PLUGIN in the configuration', () => {
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
      const { getByRole } = render(<PluginContainerWrapper />);
      expect(getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    });
  });
});
