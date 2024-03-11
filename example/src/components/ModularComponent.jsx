import React from 'react';
import PropTypes from 'prop-types';

export default function ModularComponent({ content }) {
  return (
    <section className="bg-light p-3">
      <h3>{ content.title }</h3>
      <p>
        This is a modular component that lives in the example app.
      </p>
      <p>
        <em>{content.uniqueText}</em>
      </p>
    </section>
  );
}

ModularComponent.propTypes = {
  content: PropTypes.shape({
    title: PropTypes.string,
    uniqueText: PropTypes.string,
  }),
};

ModularComponent.defaultProps = {
  content: {},
};
