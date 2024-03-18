import React, { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { useProviderHooks } from './data/hooks';

const PluginContext = createContext();

function PluginProvider({ children }) {
  const values = useProviderHooks();

  return (
    <PluginContext.Provider
      value={values}
    >
      {children}
    </PluginContext.Provider>
  );
}

PluginProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const usePluginContext = () => useContext(PluginContext);
export const usePluginCallback = (callbackName, callback) => {
  const { pluginCallback } = usePluginContext();
  return pluginCallback(callbackName, callback);
};
export const useRegisterPluginCallback = (pluginId, callbackName, callback) => {
  const { registerPluginCallback } = usePluginContext();
  return registerPluginCallback(pluginId, callbackName, callback);
};
export default PluginProvider;
