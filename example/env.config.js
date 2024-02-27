import { IFRAME_PLUGIN, PLUGIN_OPERATIONS } from '@edx/frontend-plugin-framework';

// Note that in an actual application this file would be added to .gitignore.
const config = {
  JS_FILE_VAR: 'JS_FILE_VAR_VALUE_FOR_EXAMPLE_APP',
  EXAMPLE_VAR: 'Example Value',
  ACCESS_TOKEN_COOKIE_NAME: 'edx-jwt-cookie-header-payload',
  ACCOUNT_PROFILE_URL: 'http://localhost:1995',
  ACCOUNT_SETTINGS_URL: 'http://localhost:1997',
  BASE_URL: 'http://localhost:8080',
  CREDENTIALS_BASE_URL: 'http://localhost:18150',
  CSRF_TOKEN_API_PATH: '/csrf/api/v1/token',
  DISCOVERY_API_BASE_URL: 'http://localhost:18381',
  PUBLISHER_BASE_URL: 'http://localhost:18400',
  ECOMMERCE_BASE_URL: 'http://localhost:18130',
  LANGUAGE_PREFERENCE_COOKIE_NAME: 'openedx-language-preference',
  LEARNING_BASE_URL: 'http://localhost:2000',
  LMS_BASE_URL: 'http://localhost:18000',
  LOGIN_URL: 'http://localhost:18000/login',
  LOGOUT_URL: 'http://localhost:18000/logout',
  STUDIO_BASE_URL: 'http://localhost:18010',
  MARKETING_SITE_BASE_URL: 'http://localhost:18000',
  ORDER_HISTORY_URL: 'http://localhost:1996/orders',
  REFRESH_ACCESS_TOKEN_ENDPOINT: 'http://localhost:18000/login_refresh',
  SEGMENT_KEY: null,
  SITE_NAME: 'localhost',
  USER_INFO_COOKIE_NAME: 'edx-user-info',
  LOGO_URL: 'https://edx-cdn.org/v3/default/logo.svg',
  LOGO_TRADEMARK_URL: 'https://edx-cdn.org/v3/default/logo-trademark.svg',
  LOGO_WHITE_URL: 'https://edx-cdn.org/v3/default/logo-white.svg',
  FAVICON_URL: 'https://edx-cdn.org/v3/default/favicon.ico',
  IGNORED_ERROR_REGEX: null,
  MFE_CONFIG_API_URL: null,
  APP_ID: null,
  SUPPORT_URL: 'https://support.edx.org',
  PORT: 8080,
  pluginSlots: {
    slot_with_two_iframes: {
      plugins: [
        // {
        //   op: PLUGIN_OPERATIONS.Insert,
        //   widget: {
        //     id: 'learner_record_broken_iframe_example',
        //     type: IFRAME_PLUGIN,
        //     priority: 30,
        //     url: 'http://localhost:8081/plugin1',
        //     title: 'broken_iframe_plugin_example',
        //   },
        // },
      ],
      defaultContents: [
        {
          id: 'learner_record_working_iframe_example',
          type: IFRAME_PLUGIN,
          priority: 1,
          url: 'http://localhost:8081/plugin2',
          title: 'iframe_plugin_example',
        },
      ],
    },
  },
};

export default config;
