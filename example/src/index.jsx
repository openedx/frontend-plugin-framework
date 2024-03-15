import 'core-js/stable';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import { Routes, Route } from 'react-router-dom';

import {
  AppProvider,
  ErrorPage,
  PageWrap,
} from '@edx/frontend-platform/react';
import {
  APP_INIT_ERROR, APP_READY, initialize,
} from '@edx/frontend-platform';
import { subscribe } from '@edx/frontend-platform/pubSub';

import ExamplePage from './ExamplePage';
import './index.scss';
import { PluginProvider } from '@edx/frontend-plugin-framework';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <PluginProvider>
        <Routes>
          <Route path="/" element={<PageWrap><ExamplePage /></PageWrap>} />
        </Routes>
      </PluginProvider>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [],
  requireAuthenticatedUser: false,
  hydrateAuthenticatedUser: true,
});
