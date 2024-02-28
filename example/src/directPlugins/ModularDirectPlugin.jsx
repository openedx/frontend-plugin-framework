import React from 'react';

export default function ModularDirectPlugin({ content }) {
  return (
    <main>
      <h3>A Modular Direct Plugin</h3>
      <p>
        This plugin is a component that lives in the example app and is directly inserted via JS configuration. 
        What makes this plugin unique is that it includes additional content that makes this plugin unique. 
      </p>
      <h4>
        {content.uniqueText}
      </h4>
    </main>
  );
}