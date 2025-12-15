import React from 'react';
import ReactDOM from 'react-dom/client';
import { FormRendererApp } from './FormRendererApp';

const rootElement = document.getElementById('form-renderer-root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <FormRendererApp />
    </React.StrictMode>
  );
}
