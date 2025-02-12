import 'core-js/stable';

import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Routes, Route } from 'react-router-dom';

import { AppProvider, ErrorPage, PageWrap } from '@edx/frontend-platform/react';
import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';

import DefaultIframe from './DefaultIframe';
import PluginIframe from './PluginIframe';

import './index.scss';

const container = document.getElementById('root');
const root = createRoot(container);

subscribe(APP_READY, () => {
  root.render(
    <StrictMode>
      <AppProvider>
        <Routes>
          <Route path="/default_iframe" element={<PageWrap><DefaultIframe /></PageWrap>} />
          <Route path="/plugin_iframe" element={<PageWrap><PluginIframe /></PageWrap>} />
        </Routes>
      </AppProvider>
    </StrictMode>
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  root.render(
    <StrictMode>
      <ErrorPage message={error.message} />
    </StrictMode>,
  );
});

initialize({
  messages: [],
  handlers: {
    auth: () => {},
  },
  requireAuthenticatedUser: false,
});
