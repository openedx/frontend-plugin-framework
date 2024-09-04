import React from 'react';

import { PluginSlot } from '@openedx/frontend-plugin-framework';
import classNames from 'classnames';


// Example component used as the default childen within a PluginSlot
const Username = ({ className, onClick, ...rest }) => {
  const authenticatedUser = { username: 'testuser' };
  const { username } = authenticatedUser;
  return (
    <span
      className={classNames('default-classname', className)}
      onClick={(e) => {
        console.log('Username clicked!', 'default', e);
        onClick?.(e);
      }}
      {...rest}
    >
      {username}
    </span>
  );
};

const UsernameWithPluginContent = ({ className, onClick, content = {} }) => {
  const {
    className: classNameFromPluginContent,
    onClick: onClickFromPluginContent,
    ...contentRest
  } = content;
  const updatedProps = {
    className: classNames(className, classNameFromPluginContent),
    onClick: (e) => {
      onClick?.(e);
      onClickFromPluginContent?.(e);
    },
  };
  return <Username {...updatedProps} {...contentRest} />;
};

function PluginSlotWithModifyDefaultContents({ id, label }) {
  return (
    <div className="border border-primary px-3">
      <h3 id={id}>{label}</h3>
      <p>
        The following <code>PluginSlot</code> examples demonstrate the <code>PLUGIN_OPERATIONS.Modify</code> operation, when
        the <code>widgetId</code> is <code>default_contents</code>. Any configured, custom plugin <code>content</code> is
        merged with any existing props passed to the component(s) represented by <code>default_contents</code>.
      </p>
      <ul>
        <li>Custom <code>className</code> overrides are concatenated with the <code>className</code> prop passed to the <code>default_contents</code> component(s), if any.</li>
        <li>Custom <code>style</code> overrides are shallow merged with the <code>style</code> prop passed to the <code>default_contents</code> component(s), if any.</li>
        <li>Custom event handlers (e.g., <code>onClick</code>) are executed in sequence, after any event handlers passed to the <code>default_contents</code> component(s), if any.</li>
      </ul>
      <PluginSlot
        id="slot_with_username_pii"
        as="div"
        // Default slotOptions
      >
        <UsernameWithPluginContent
          className="testing"
          onClick={(e) => {
            console.log('Username clicked!', 'prop', e);
          }}
        />
      </PluginSlot>
      <PluginSlot 
        id="slot_with_username_pii"
        as="div"
        slotOptions={{
          mergeProps: true,
        }}
      >
        <Username
          className="d-block abc123"
          onClick={(e) => {
            console.log('Username clicked!', 'prop', e);
          }}
        />
      </PluginSlot>
      <PluginSlot
        id="slot_with_username_pii"
        as="div"
        pluginProps={{
          className: 'bg-accent-b',
          onClick: (e) => { console.log('Username clicked!', 'pluginProps', e); },
        }}
        slotOptions={{
          mergeProps: true,
        }}
      >
        <Username
          className="ghi789"
          onClick={(e) => {
            console.log('Username clicked!', 'prop', e);
          }}  
        />
      </PluginSlot>
    </div>
  );
}

export default PluginSlotWithModifyDefaultContents;
