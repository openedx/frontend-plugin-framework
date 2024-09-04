import {
  Container, Row, Col, Stack,
} from '@openedx/paragon';

import PluginSlotWithModifyDefaultContents from './pluginSlots/PluginSlotWithModifyDefaultContents';
import PluginSlotWithInsert from './pluginSlots/PluginSlotWithInsert';
import PluginSlotWithModifyWrapHide from './pluginSlots/PluginSlotWithModifyWrapHide';
import PluginSlotWithModularPlugins from './pluginSlots/PluginSlotWithModularPlugins';
import PluginSlotWithoutDefault from './pluginSlots/PluginSlotWithoutDefault';

const pluginExamples = [
  {
    id: 'plugin-operation-insert',
    label: 'Plugin Operation: Insert',
    Component: PluginSlotWithInsert,
  },
  {
    id: 'plugin-operation-modify-wrap-hide',
    label: 'Plugin Operation: Modify, Wrap, and Hide',
    Component: PluginSlotWithModifyWrapHide,
  },
  {
    id: 'plugin-operation-modify-default-content',
    label: 'Plugin Operation: Modify Default Content',
    Component: PluginSlotWithModifyDefaultContents,
  },
  {
    id: 'direct-plugins-modular-components',
    label: 'Direct Plugins Using Modular Components',
    Component: PluginSlotWithModularPlugins,
  },
  {
    id: 'no-default-content',
    label: 'Default Content Set to False',
    Component: PluginSlotWithoutDefault,
  },
];

export default function ExamplePage() {
  return (
    <main>
      <Container size="lg" className="py-3">
        <Row>
          <Col>
            <h1>Plugins Page</h1>
            <p>
              This page is here to help test the plugins module.  A plugin configuration can be added in
              index.jsx and this page will display that plugin.
            </p>
            <p>
              To do this, a plugin MFE must be running on some other port.
              To make it a more realistic test, you may also want to edit your
              /etc/hosts file (or your system&apos;s equivalent) to provide an alternate domain for
              127.0.0.1 at which you can load the plugin.
            </p>
            <h2>Examples</h2>
            <Stack gap={3}>
              <ul>
                {pluginExamples.map(({ id, label }) => (
                  <li key={id}>
                    <a href={`#${id}`}>{label}</a>
                  </li>
                ))}
              </ul>
              <Stack gap={5}>
                {pluginExamples.map(({ Component, id, label }) => <Component key={id} id={id} label={label} />)}
              </Stack>
            </Stack>
          </Col>
        </Row>
      </Container>
    </main>
  );
}
