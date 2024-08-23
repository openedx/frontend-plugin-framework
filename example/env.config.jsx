import React from 'react';
import {
  DIRECT_PLUGIN,
  IFRAME_PLUGIN,
  PLUGIN_OPERATIONS,
} from '@openedx/frontend-plugin-framework';
import PluginDirect from './src/components/PluginDirect';
import ModularComponent from './src/components/ModularComponent';

const modifyWidget = (widget) => {
  const newContent = {
    title: 'Modified Modular Plugin',
    uniqueText: 'Note that the original text defined in the JS config is replaced by this modified one.',
  };
  const modifiedWidget = widget;
  modifiedWidget.content = newContent;
  return modifiedWidget;
};

const modifyWidgetDefaultContents = (widget) => {
  const newContent = {
    'data-custom-attr': 'customValue',
    'data-another-custom-attr': '',
    className: 'font-weight-bold',
    style: { color: 'blue' },
    onClick: (e) => { console.log('Username clicked!', 'custom', e); },
  };
  widget.content = newContent;
  return widget;
};

const wrapWidget = ({ component }) => (
  <div className="bg-warning" data-testid="wrapper">
    <div className="px-3">
      <p className="mb-0">This is a wrapper component that is placed around the default content.</p>
    </div>
    {component}
    <div className="px-3">
      <p>With this wrapper, you can add anything before or after a component.</p>
      <p className="mb-0">Note in the JS config that an iFrame plugin was Inserted, but a Hide operation was also used to hide it!</p>
    </div>
  </div>
);

// Note that in an actual application this file would be added to .gitignore.
const config = {
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
  MFE_CONFIG_API_URL: null,
  APP_ID: null,
  SUPPORT_URL: 'https://support.edx.org',
  PORT: 8080,
  pluginSlots: {
    slot_with_insert_operation: {
      keepDefault: true,
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'inserted_direct_plugin',
            type: DIRECT_PLUGIN,
            priority: 10,
            RenderWidget: PluginDirect,
          },
        },
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
      ],
    },
    slot_with_modify_wrap_hidden_operations: {
      keepDefault: true,
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'inserted_plugin',
            type: DIRECT_PLUGIN,
            priority: 10,
            RenderWidget: ModularComponent,
            content: {
              title: 'Modular Direct Plugin',
              uniqueText: 'This is some text that will be replaced by the Modify operation below.',
            },
          },
        },
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'inserted_iframe_plugin',
            type: IFRAME_PLUGIN,
            priority: 30,
            url: 'http://localhost:8081/plugin_iframe',
            title: 'This iFrame plugin will be hidden due to the Hide operation in this config.',
          },
        },
        {
          op: PLUGIN_OPERATIONS.Wrap,
          widgetId: 'default_contents',
          wrapper: wrapWidget,
        },
        {
          op: PLUGIN_OPERATIONS.Modify,
          widgetId: 'inserted_plugin',
          fn: modifyWidget,
        },
        {
          op: PLUGIN_OPERATIONS.Hide,
          widgetId: "inserted_iframe_plugin",
        },
      ],
    },
    slot_with_modular_plugins: {
      keepDefault: true,
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'insert_modular_direct_plugin',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: ModularComponent,
            content: {
              title: 'Modular Direct Plugin',
              uniqueText: 'This is a direct plugin with priority of 1, which is why it appears first in this slot.',
            },
          },
        },
      ],
    },
    slot_without_default: {
      keepDefault: false,
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'insert_direct_plugin',
            type: DIRECT_PLUGIN,
            priority: 1,
            RenderWidget: ModularComponent,
            content: {
              title: 'Modular Direct Plugin With Content Defined in JS Config',
              uniqueText: 'This modular component receives some of its content from the JS config (such as this text).',
            },
          },
        },
        {
          op: PLUGIN_OPERATIONS.Insert,
          widget: {
            id: 'insert_another_direct_plugin',
            type: DIRECT_PLUGIN,
            priority: 10,
            RenderWidget: PluginDirect,
          },
        },
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
      ],
    },
    slot_with_username_pii: {
      keepDefault: true,
      plugins: [
        {
          op: PLUGIN_OPERATIONS.Modify,
          widgetId: 'default_contents',
          fn: modifyWidgetDefaultContents,
        },
      ],
    },
  },
};

export default config;
