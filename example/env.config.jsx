import {
  DIRECT_PLUGIN,
  IFRAME_PLUGIN,
  PLUGIN_OPERATIONS,
} from '@edx/frontend-plugin-framework';
import DefaultDirectWidget from './src/directPlugins/DefaultDirectWidget';
import PluginDirect from './src/directPlugins/PluginDirect';
import ModularDirectPlugin from './src/directPlugins/ModularDirectPlugin';

const modifyWidget = (widget) => {
  const newContent = {
    title: 'Modified Default Widget',
    uniqueText: 'Note that the default text is replaced by this one that is defined in the JS configuration.',
  };
  const modifiedWidget = widget;
  modifiedWidget.content = newContent;
  return modifiedWidget;
};

const wrapWidget = ({ component, idx }) => (
  <div className="bg-warning" data-testid={`wrapper${idx + 1}`} key={idx}>
    <p>This is a wrapper component that is placed around the widget.</p>
    {component}
    <p>With this wrapper, you can add anything before or after the widget.</p>
  </div>
);

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
    slot_with_insert_operation: {
      defaultContents: [
        {
          id: 'default_iframe_widget',
          type: IFRAME_PLUGIN,
          priority: 1,
          url: 'http://localhost:8081/default_iframe',
          title: 'The default iFrame widget that appears in the plugin slot',
        },
        {
          id: 'default_direct_widget',
          type: DIRECT_PLUGIN,
          priority: 20,
          RenderWidget: DefaultDirectWidget,
        },
      ],
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'inserted_iframe_plugin',
            type: IFRAME_PLUGIN,
            priority: 30,
            url: 'http://localhost:8081/plugin_iframe',
            title: 'The iFrame plugin that is inserted in the slot',
          },
        },
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'inserted_direct_plugin',
            type: DIRECT_PLUGIN,
            priority: 10,
            RenderWidget: PluginDirect,
          },
        },
      ],
    },
    slot_with_modify_wrap_hidden_operations: {
      defaultContents: [
        {
          id: 'default_direct_widget',
          type: DIRECT_PLUGIN,
          priority: 1,
          RenderWidget: ModularDirectPlugin,
          content: {
            title: 'Default Direct Widget',
            uniqueText: "This widget's content will be modified by the Modify operation below.",
          },
        },
        {
          id: 'default_iframe_widget',
          type: IFRAME_PLUGIN,
          priority: 2,
          url: 'http://localhost:8081/default_iframe',
          title: 'The default iFrame widget that appears in the plugin slot',
        },
      ],
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Wrap,
          widgetId: 'default_direct_widget',
          wrapper: wrapWidget,
        },
        {
          op: PLUGIN_OPERATIONS.Modify,
          widgetId: 'default_direct_widget',
          fn: modifyWidget,
        },
        {
          op: PLUGIN_OPERATIONS.Hide,
          widgetId: 'default_iframe_widget',
        },
      ],
    },
    slot_with_modular_plugins: {
      defaultContents: [
        {
          id: 'default_direct_widget',
          type: DIRECT_PLUGIN,
          priority: 10,
          RenderWidget: ModularDirectPlugin,
          content: {
            title: 'Default Direct Widget',
            uniqueText: 'This is a direct widget with priority of 10, which is why it appears second in this slot.',
          },
        },
      ],
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'inserted_direct_plugin',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: ModularDirectPlugin,
            content: {
              title: 'Inserted Direct Plugin',
              uniqueText: 'This is a direct plugin with priority of 1, which is why it appears first in this slot.',
            },
          },
        },
      ],
    },
  },
};

export default config;
