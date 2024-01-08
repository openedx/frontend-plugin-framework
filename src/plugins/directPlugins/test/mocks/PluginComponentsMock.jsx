/* eslint-disable react/prop-types */
// eslint-disable-next-line import/no-extraneous-dependencies
import React from 'react';
import {
  House, Star, InsertDriveFile, Login,
} from '@edx/paragon/icons';
import { DirectPluginOperations } from '../..';

/** This is for us to be able to mock in tests */
const isAdminHelper = () => true;

/** This is a React widget that wraps its children and makes them visible only to administrators */
const HideExceptForAdmin = ({ widget }) => {
  const isAdmin = isAdminHelper();
  return <React.Fragment key={widget.key}>{isAdmin ? widget : null}</React.Fragment>;
};

const navLinksPlugin = {
  id: 'links-demo', // id isn't used anywhere, but can be extended to
  defaultComponentProps: [
    {
      id: 'home',
      priority: 5,
      content: { url: '/', icon: House, label: 'Home' },
    },
    {
      id: 'lookup',
      priority: 25,
      content: { url: '/lookup', icon: Star, label: 'Lookup' },
    },
    {
      id: 'drafts',
      priority: 35,
      content: { url: '/drafts', icon: InsertDriveFile, label: 'Drafts' },
    },
  ],
  getDirectSlotChanges() {
    return {
      'side-bar-nav': [ // slot id that is used by directpluginslot
        // Hide the "Drafts" link, except for administrators:
        {
          op: DirectPluginOperations.Wrap,
          widgetId: 'drafts',
          wrapper: HideExceptForAdmin,
        },
        // Add a new login link after the rest of default plugins:
        {
          op: DirectPluginOperations.Insert,
          widget: {
            id: 'login',
            priority: 50,
            content: {
              url: '/login', icon: Login, label: 'Login',
            },
          },
        },
      ],
    };
  },
};

export {
  isAdminHelper,
  navLinksPlugin,
};
