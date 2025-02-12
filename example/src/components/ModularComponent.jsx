import React from 'react';
import PropTypes from 'prop-types';

export default function ModularComponent({ content = {} }) {
  return (
    <section className="bg-light p-3">
      <h4>{content.title}</h4>
      <p>
        This is a modular component that lives in the example app.
      </p>
      <p className="mb-0">
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
