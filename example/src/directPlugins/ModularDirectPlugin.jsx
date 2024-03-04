import React from 'react';
import PropTypes from 'prop-types';

export default function ModularDirectPlugin({ content }) {
  return (
    <section className="bg-light p-3">
      <h3>{ content.title }</h3>
      <p>
        This plugin is a component that lives in the example app and is directly inserted via JS configuration.
        What makes this plugin unique is that it takes in some &quot;content&quot; from the JS configuration and is able
        to apply that content accordingly (as shown below).
      </p>
      <p>
        <em>{content.uniqueText}</em>
      </p>
    </section>
  );
}

ModularDirectPlugin.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    uniqueText: PropTypes.string,
  }),
};

ModularDirectPlugin.defaultProps = {
  content: {},
};
