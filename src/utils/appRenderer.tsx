import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { handleRenderError } from './errorHandlers/renderErrorHandler';
import React from 'react';

/**
 * Renders the application to the DOM
 */
export const renderApp = (): void => {
  try {
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Root element not found');
      return;
    }

    console.log('Starting to render application...');

    // Render the application
    createRoot(rootElement).render(
      React.createElement(
        BrowserRouter,
        null,
        React.createElement(App, null)
      )
    );

    console.log('App successfully mounted');
  } catch (error) {
    handleRenderError(error);
  }
};