import React from 'react'
import ReactDOM from 'react-dom/client'
import { IntlProvider } from 'react-intl';
import { APP_READY, initialize, subscribe } from '@edx/frontend-platform';
// import { MockAuthService } from '@edx/frontend-platform/auth';
import { NullAuthService } from './NullAuthService.ts';

import App from './App.tsx'
import './index.css'

subscribe(APP_READY, () => {

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <IntlProvider
        locale={navigator.language}
        onError={() => { /* Suppress errors about missing messages - we don't localize this example */}}
      >
        <App />
      </IntlProvider>
    </React.StrictMode>,
  )

});

// frontend-plugin-framework depends on getConfig() from frontend-platform,
// and it's currently impossible to initialize frontend-platform's config service
// without trying to initialize a whole bunch of other services that we don't
// want for this demo :/
initialize({
  // We can't even use 'MockAuthService' because it depends on jest, which would be a crazy dependency for a tiny demo,
  // so we have to create our own Null auth service.
  authService: NullAuthService,
  messages: {},
  requireAuthenticatedUser: false,
  hydrateAuthenticatedUser: false,
});
