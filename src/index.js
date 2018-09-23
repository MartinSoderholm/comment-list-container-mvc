import React from 'react';
import ReactDOM from 'react-dom';

import CommentListContainer from './container-mvc';

// Container div
let divEl = document.querySelector('body > div');
if (!divEl) {
  divEl = document.createElement('div');
  // Add to body
  document.body.appendChild(divEl);
}

documentReady(() => {
  // Render component
  ReactDOM.render(<CommentListContainer />, divEl);
});

if (module.hot) {
  console.log('Accepting the updated module!');
  // Accept module
  module.hot.accept();
}

/**
 * Add callback for "document ready" state
 */
export function documentReady(callback) {
  // If not loading, callback()
  if (document.readyState !== 'loading') {
    callback();
  // else, add listener
  } else {
    document.addEventListener('DOMContentLoaded', callback);
  }
}
