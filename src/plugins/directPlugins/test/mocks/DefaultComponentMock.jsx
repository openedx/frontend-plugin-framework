// eslint-disable-next-line import/no-extraneous-dependencies
import { Icon } from '@edx/paragon';
import { DirectPluginSlot, DirectPluginsContext } from '../..';
import { navLinksPlugin } from './PluginComponentsMock';

// TODO: remove DirectPluginsContext and enabledPlugins from here once we have an example app
// these simply demonstrate how the root App would have needed this setup in order to pass in the plugin config
// and make it available to a given DirectPluginSlot

const enabledPlugins = [
  navLinksPlugin,
];

const MyApp = () => (
  <DirectPluginsContext value={enabledPlugins}>
    <div>
      <DirectPluginSlot
        slotId="side-bar-nav"
        defaultContents={navLinksPlugin.defaultLinks}
        renderWidget={(link) => (
          <a
            href={link.content.url}
            key={link.id}
          >
            <Icon src={link.content.icon} /> {link.content.label}
          </a>
        )}
      />
    </div>
  </DirectPluginsContext>
);

export default MyApp;
