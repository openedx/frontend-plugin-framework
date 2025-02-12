import 'core-js/stable';

import React, { StrictMode } from 'react';
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
import { createRoot } from 'react-dom/client';

const container = document.getElementById('root');
const root = createRoot(container);

subscribe(APP_READY, () => {
  root.render(
    <StrictMode>
      <AppProvider>
        <Routes>
          <Route path="/" element={<PageWrap><ExamplePage /></PageWrap>} />
        </Routes>
      </AppProvider>,
    </StrictMode>,
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
  requireAuthenticatedUser: false,
  hydrateAuthenticatedUser: false,
});
