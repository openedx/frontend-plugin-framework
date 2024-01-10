//   DirectPluginsSlot (defaultContents, slotId, renderWidget)
//     call the DirectPluginsContext to get the enabledPlugins
//     assign `contents` variable to a useMemo-wrapped usePreparePlugins (defaultContents, enabledPlugins)
//     return logic to render plugins by mapping through contents
