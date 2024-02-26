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
  APP_INIT_ERROR, APP_READY, initialize, APP_CONFIG_INITIALIZED,
} from '@edx/frontend-platform';
import { subscribe } from '@edx/frontend-platform/pubSub';
import { mergeConfig } from '@edx/frontend-platform/config';
import { IFRAME_PLUGIN } from '@edx/frontend-plugin-framework/plugins';

import ExamplePage from './ExamplePage';
import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <Routes>
        <Route path="/" element={<PageWrap><ExamplePage /></PageWrap>} />
      </Routes>
    </AppProvider>,
    document.getElementById('root'),
  );
});

// TODO fix this config to match what is realistically needed

// subscribe(APP_CONFIG_INITIALIZED, () => {
//   mergeConfig({
//     plugins: {
//       example: {
//         keepDefault: true,
//         plugins: [
//           {
//             url: 'http://localhost:8081/plugin1',
//             type: IFRAME_PLUGIN,
//           },
//           {
//             url: 'http://localhost:8081/plugin2',
//             type: IFRAME_PLUGIN,
//           },
//         ],
//       },
//     },
//   }, 'App config initialized override handler');
// });

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});
initialize({
  messages: [],
  requireAuthenticatedUser: false,
  hydrateAuthenticatedUser: true,
});
