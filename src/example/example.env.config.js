/*
The Frontend Plugin Framework uses the env.config.js file to extract the layout configuration for the plugins.

The PluginSlot will find the configuration by the provided ID which matches a key inside the `pluginSlots` object

Note: having both .env and env.config.js files will follow a predictable order, in which non-empty values in the
JS-based config will overwrite the .env environment variables.

frontend-platform's getConfig loads configuration in the following sequence:
- .env file config
- optional handlers (commonly used to merge MFE-specific config in via additional process.env variables)
- env.config.js file config
- runtime config
*/

/** TODO: Examples still need to be set up as part of APER-3042 https://2u-internal.atlassian.net/browse/APER-3042 */

// module.exports = {
//   pluginSlots: {
//     example_plugin_slot: {
//       keepDefault: false,
//       plugins: [
//         {
//           id: 'example_plugin',
//           type: 'IFRAME_PLUGIN',
//           url: 'http://localhost:{PORT}/{ROUTE}',
//         },
//       ],
//     },
//   },
// };
