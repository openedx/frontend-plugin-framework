import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { configure as configureI18n } from '@edx/frontend-platform/i18n';
import { configure as configureLogging, MockLoggingService } from '@edx/frontend-platform/logging';
import { getConfig, mergeConfig } from '@edx/frontend-platform';
import { configure as configureAuth, MockAuthService } from '@edx/frontend-platform/auth';

// eslint-disable-next-line import/prefer-default-export
export function initializeMockApp() {
  mergeConfig({
    authenticatedUser: {
      userId: 'abc123',
      username: 'Mock User',
      roles: [],
      administrator: false,
    },
    // ...envConfig,
  });

  const loggingService = configureLogging(MockLoggingService, {
    config: {},
  });

  const i18nService = configureI18n({
    config: {},
    loggingService,
  });

  const authService = configureAuth(MockAuthService, { config: {}, loggingService });
  return { loggingService, i18nService, authService };
}
