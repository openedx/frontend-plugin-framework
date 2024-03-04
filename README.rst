Frontend Plugin Framework
##########################

|license-badge| |status-badge| |ci-badge| |codecov-badge|

.. |license-badge| image:: https://img.shields.io/github/license/openedx/frontend-plugin-framework.svg
    :target: https://github.com/openedx/frontend-plugin-framework/blob/master/LICENSE
    :alt: License

.. |status-badge| image:: https://img.shields.io/badge/Status-Maintained-brightgreen

.. |ci-badge| image:: https://github.com/openedx/frontend-plugin-framework/actions/workflows/ci.yml/badge.svg
    :target: https://github.com/openedx/frontend-plugin-framework/actions/workflows/ci.yml
    :alt: Continuous Integration

.. |codecov-badge| image:: https://codecov.io/github/openedx/frontend-plugin-framework/coverage.svg?branch=master
    :target: https://codecov.io/github/openedx/frontend-plugin-framework?branch=master
    :alt: Codecov

Purpose
=======

This is the Frontend Plugin Framework library. This framework is designed to allow for any type of plugin to be used
when plugging a child component into a Host MFE. The current plugins made available are either the Direct Plugin or
iFrame-based Plugin.

The Direct Plugin allows for a component in the Host MFE or React dependency be made into a plugin and inserted into a
slot.
The iFrame-based Plugin allows for a component that lives in another MFE (the Child MFE) to be plugged into a slot in
the Host MFE.

The primary way this is made possible is through JS-based configurations, where the changes to a plugin slot are defined
(see 'Plugin Operations').

Getting Started
===============
Using the Example Apps
----------------------

1. Run ``npm install`` in the root directory.

2. In separate terminals, run ``npm install`` inside both example app directories (``/example`` and ``/example-plugin-app``).

3. Run ``npm run start`` in both directories.

Alternatively, once the packages are installed in both apps, you can run the apps from the root directory.

1. ``npm run start`` runs the host MFE (``example``)

2. ``npm run start:plugins`` runs the child MFE (``example-plugin-app``)

Add Library Dependency
----------------------

Add ``openedx/frontend-plugin-framework`` to the ``package.json`` of both Host and Child MFEs.

Host Micro-frontend (MFE)
-------------------------

Host MFEs define ``PluginSlot`` components in areas of the UI where they intend to accept plugin extensions.
The Host MFE, and thus the maintainers of the Host MFE, are responsible for deciding where it is acceptable to add a
plugin slot.
The slot also determines the dimensions and responsiveness of each plugin, and supports passing any additional
data to the plugin as part of its contract.

  .. code-block::

    <HostApp>
      <Route path="/page1">
        <SomeHostContent />
        <PluginSlot
          id="sidebar" // this `id` is referenced in the JS-based config
          pluginProps={{ // these props are passed along to each plugin
            className: 'flex-grow-1',
            title: 'example plugins',
          }}
          style={{
            height: 700,
          }}
        />
      </Route>
      <Route path="/page2">
        <OtherRouteContent />
      </Route>
    </HostApp>

Host MFE JS-based Configuration
-------------------------------

Micro-frontends that would like to use the Plugin Framework need to use a JavaScript-based config named ``env.config``
with either ``.js`` or ``.jsx`` as the extension. Technically, only the Host MFE requires an ``env.config.js`` file
as that is where the plugin slot's configuration is defined.

However, note that any Child MFE can theoretically contain one or more ``PluginSlot`` components themselves,
thereby making it both a Child MFE and a Host MFE. In this instance, the Child MFE would need its own ``env.config.js``
file as well to define its plugin slots.

  .. code-block::

    // env.config.js

    import { DIRECT_PLUGIN, IFRAME_PLUGIN, PLUGIN_OPERATIONS } from '@edx/frontend-plugin-framework';
    
    // import any additional dependencies or functions to be used for each plugin operation
    import Sidebar from './widgets/social/Sidebar';
    import SocialMediaLink from './widgets/social/SocialMediaLink';
    import { wrapSidebar, modifySidebar } from './widgets/social/utils';
    import { SomeIcon } from '@openedx/paragon/icons';

    const config = {
      // additional environment variables
      pluginSlots: {
        sidebar: { // plugin slot id
          defaultContents: [
            {
              id: 'default_sidebar_widget',
              type: DIRECT_PLUGIN,
              priority: 10,
              RenderWidget: SideBar,
              content: {
                propExampleA: 'edX Sidebar',
                propExampleB: SomeIcon,
              },
            },
          ],
          plugins: [
            {
              op: PLUGIN_OPERATIONS.Insert,
              widget: {
                id: 'social_media_link',
                type: DIRECT_PLUGIN,
                priority: 10,
                RenderWidget: SocialMediaLink,
              },
            },
            {
              op: PLUGIN_OPERATIONS.Wrap,
              widgetId: 'default_content_in_slot',
              wrapper: wrapWidget,
            },
            {
              op: PLUGIN_OPERATIONS.Modify,
              widgetId: 'default_content_in_slot',
              fn: modifyWidget,
            },
          ]
        }
      }
    }

    export default config;

For more information on how JS based configuration works, see the `config.js`_ file in frontend-platform.

.. _config.js: https://github.com/openedx/frontend-platform/blob/master/src/config.js

Plugin Operations
`````````````````
There are four plugin operations that each require specific properties.

Insert a Direct Plugin
''''''''''''''''''''''

  .. code-block::

    /*
    * {String} op - Name of plugin operation
    * {Object} widget - The component to be inserted into the slot
    * {String} widget.id - The widget id needed for referencing when using Modify/Wrap/Hide
    * {String} widget.type - The type of plugin being used
    * {Number} widget.priority - The place to insert the widget based on the priority of other widgets (between 1 - 100)
    * {Function} widget.RenderWidget - The React component to be used
    * {Object} [widget.contents] - Any props to pass into the RenderWidget component
    */

    {
      op: PLUGIN_OPERATIONS.Insert,
      widget: {
        id: 'social_media_link',
        type: DIRECT_PLUGIN,
        priority: 10,
        RenderWidget: SocialMediaLink,
      },
    }

Insert an iFrame Plugin
'''''''''''''''''''''''

  .. code-block::

    /*
      * {String} op - Name of plugin operation
      * {Object} widget - The component to be inserted into the slot
      * {String} widget.id - The widget id needed for referencing when using Modify/Wrap/Hide
      * {String} widget.type - The type of plugin being used
      * {Number} widget.priority - The place to insert the widget based on the priority of other widgets (between 1 - 100)
      * {String} widget.url - The URL from a Child MFE to fetch the widget component
      * {String} widget.title - The title of the iFrame that is read aloud with screen readers
    */

    {
      op: PLUGIN_OPERATIONS.Insert,
      widget: {
        id: 'enterprise_navbar',
        type: IFRAME_PLUGIN,
        priority: 30,
        url: 'http://{child_mfe_url}/plugin_iframe',
        title: 'Login with XYZ',
      },
    },

Modify
''''''

  .. code-block::

    /*
      * {String} op - Name of plugin operation
      * {String} widgetId - The widget id needed for referencing when using Modify/Wrap/Hide
      * {Function} fn - The function to call that can modify the widget's contents and properties
    */

    {
      op: PLUGIN_OPERATIONS.Insert,
      widgetId: 'default_content_in_slot',
      fn: modifyWidget,
    }

Wrap
''''

  .. code-block::

    /*
      * {String} op - Name of plugin operation
      * {String} widgetId - The widget id needed for referencing when using Modify/Wrap/Hide
      * {Function} wrapper - The function to call that can wrap the widget with a React component
    */

    {
      op: PLUGIN_OPERATIONS.Wrap,
      widgetId: 'default_content_in_slot',
      wrapper: wrapWidget,
    },

Hide
''''

  .. code-block::

    /*
      * {String} op - Name of plugin operation
      * {String} widgetId - The widget id needed for referencing when using Modify/Wrap/Hide
    */

    {
      op: PLUGIN_OPERATIONS.Hide,
      widgetId: 'default_content_in_slot',
    }

Priority
````````
The priority property determines where the widgets should be placed based on a 1-100 scale. A widget with a priority of 10
will appear above a widget with a priority of 20. The default content will have a priority of 50, allowing for any plugins
to appear before or after the default content.

Using a Child Micro-frontend (MFE) for iFrame-based Plugins and Fallback Behavior
---------------------------------------------------------------------------------

The Child MFE is no different than any other MFE except that it can define a component that can then be pass into the Host MFE
as an iFrame-based plugin via a route.
This component communicates (via ``postMessage``) with the Host MFE and resizes its content to match the dimensions
available in the Host's plugin slot.

It's notoriously difficult to know in the Host MFE when an iFrame has failed to load.
Because of security sandboxing, the host isn't allowed to know the HTTP status of the request or to inspect what was
loaded, so we have to rely on waiting for a ``postMessage`` event from within the iFrame to know it has successfully loaded.
A fallback component can be provided to the Plugin that is wrapped around the component, as noted below.
Otherwise, the `default Error fallback from Frontend Platform`_ would be used.

  .. code-block::

    <MyMFE>
      <Route path="/mainContent">
          <MyMainContent />
      </Route>
      <Route path="/plugin1">
        <Plugin fallbackComponent={<OtherFallback />}>
          <MyCustomContent />
        </Plugin>
      </Route>
    </MyMFE>

.. _default Error fallback from Frontend Platform: https://github.com/openedx/frontend-platform/blob/master/src/react/ErrorBoundary.jsx

Known Issues
============

Development Roadmap
===================

The main priority in developing this library is to extract components from a Host MFE to allow for teams to develop 
experimental features without impeding on any other team's work or the core functionality of the Host MFE. 

- The first target is to use this framework in Learner Dashboard MFE to extract the Recommendations panel out of the repo.

- Incorporate other plugin proposals from the Frontend Pluggability Summit in order to provide the most appropriate plugin option for a given component.

Getting Help
============

If you're having trouble, we have discussion forums at
https://discuss.openedx.org where you can connect with others in the community.

Our real-time conversations are on Slack. You can request a `Slack
invitation`_, then join our `community Slack workspace`_.  Because this is a
frontend repository, the best place to discuss it would be in the `#wg-frontend
channel`_.

For anything non-trivial, the best path is to open an issue in this repository
with as many details about the issue you are facing as you can provide.

https://github.com/openedx/frontend-plugin-framework/issues

For more information about these options, see the `Getting Help`_ page.

.. _Slack invitation: https://openedx.org/slack
.. _community Slack workspace: https://openedx.slack.com/
.. _#wg-frontend channel: https://openedx.slack.com/archives/C04BM6YC7A6
.. _Getting Help: https://openedx.org/getting-help

License
=======

The code in this repository is licensed under the AGPLv3 unless otherwise
noted.

Please see `LICENSE <LICENSE>`_ for details.

Contributing
============

Contributions are very welcome.  Please read `How To Contribute`_ for details.

.. _How To Contribute: https://openedx.org/r/how-to-contribute

This project is currently accepting all types of contributions, bug fixes,
security fixes, maintenance work, or new features.  However, please make sure
to have a discussion about your new feature idea with the maintainers prior to
beginning development to maximize the chances of your change being accepted.
You can start a conversation by creating a new issue on this repo summarizing
your idea.

The Open edX Code of Conduct
============================

All community members are expected to follow the `Open edX Code of Conduct`_.

.. _Open edX Code of Conduct: https://openedx.org/code-of-conduct/

People
======

The assigned maintainers for this component and other project details may be
found in `Backstage`_. Backstage pulls this data from the ``catalog-info.yaml``
file in this repo.

.. _Backstage: https://open-edx-backstage.herokuapp.com/catalog/default/component/frontend-plugin-framework

Reporting Security Issues
=========================

Please do not report security issues in public.  Email security@openedx.org instead.
