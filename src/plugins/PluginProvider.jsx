import React, { createContext } from 'react';
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

export const usePluginContext = () => React.useContext(PluginContext);
export default PluginProvider;
