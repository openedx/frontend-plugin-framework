/** Context which makes the list of enabled plugins available to the <UiSlot> components below it in the React tree */
// export const DirectPluginsContext = React.createContext([]);

// whenever the PluginSlot gets called and needs to prepare for rendering
//   call the DirectPluginsContext to get the enabledPlugins

//   sift through the enabledPlugins to find the relevant one we need for this slot
//   enabledPlugins.forEach(plugin => {
//   const changes = plugin.getUiSlotChanges(); // Optional: Pass in any app-specific context that the plugin wants
//   const slotChanges = changes[slotId] ?? [];
//   TODO: above could be condensed to:
//   const changes = plugin.getUiSlotChanges()[slotId] ?? [];
//   call on usePreparePlugins, passing in changes, which includes the pluginChanges and defaultcontent
