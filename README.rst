frontend-plugin-framework
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

This is the Frontend Plugin Framework library. This framework is designed to allow for any type of plugin to be used when
plugging a child component into a Host MFE. The current plugin that is made available is iFrame-based, which allows
for a component that lives in another MFE (the 'Child MFE') to be plugged into a Plugin Slot that lives in the 'Host MFE'.

Getting Started
===============
1. Add Library Dependency
-------------------------

Add ``@edx/frontend-plugin-framework`` to the ``package.json`` of both Host and Child MFEs.

Micro-frontend configuration document (JS)
------------------------------------------

Micro-frontends that would like to use the Plugin Framework need to be configured via a JavaScript configuration
document and a ``pluginSlots`` config. Technically, only the Host MFE requires an ``env.config.js`` file with a ``pluginSlots`` config.

However, note that any Child MFE can theoretically contain one or more ``PluginSlot`` components, thereby making it both a Child MFE and a Host MFE.
In this instance, it would have its own JavaScript file to configure the ``PluginSlot``.

For more information on how JS based configuration works, see the `config.js`_ file in frontend-platform.

  .. code-block::

    const config = {
      // other existing configuration
      pluginSlots: {
        sidebar: {
          plugins: [
            {
              id: 'plugin1',
              url: 'https://plugin.app/plugin1',
              type: IFRAME_PLUGIN,
            }
          ]
        }
      }
    }

.. _config.js: https://github.com/openedx/frontend-platform/blob/556424ee073e0629d7331046bbd7714d0d241f43/src/config.js

Host Micro-frontend (JSX)
-------------------------

Hosts must define ``PluginSlot`` components in areas of the UI where they intend to accept extensions.
The Host MFE, and thus the owners of the Host MFE, are responsible for deciding where it is acceptable to mount a plugin.
They also decide the dimensions, responsiveness/scrolling policy, and whether the slot supports passing any additional
data to the plugin as part of its contract.

  .. code-block::

    <HostApp>
      <Route path="/page1">
        <SomeHostContent />
        <PluginSlot
          id="sidebar" // as noted in the section above, this `id` is used to pass in Child plugin configuration
          pluginProps={{
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


Plugin Micro-frontend (JSX) and Fallback Behavior
-------------------------------------------------

The plugin MFE is no different than any other MFE except that it defines a Plugin component as a child of a route.
This component is responsible for communicating (via ``postMessage``) with the host page and resizing its content to match
the dimensions available in the host’s PluginSlot. 

It’s notoriously difficult to know in the host application when an iFrame has failed to load.
Because of security sandboxing, the host isn’t allowed to know the HTTP status of the request or to inspect what was
loaded, so we have to rely on waiting for a ``postMessage`` event from within the iFrame to know it has successfully loaded.
For the fallback content, the Plugin-owning team would pass a fallback component into the Plugin tag that is wrapped around their component, as noted below. Otherwise, a default fallback component would be used.
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
