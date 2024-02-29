import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route } from 'react-router-dom';

import { AppProvider, ErrorPage, PageWrap } from '@edx/frontend-platform/react';
import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';

import DefaultIframe from './DefaultIframe';
import PluginIframe from './PluginIframe';

import './index.scss';
subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <Routes>
        <Route path="/default_iframe" element={<PageWrap><DefaultIframe /></PageWrap>} />
        <Route path="/plugin_iframe" element={<PageWrap><PluginIframe /></PageWrap>} />
      </Routes>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [],
  handlers: {
    auth: () => {},
  },
  requireAuthenticatedUser: false,
});
