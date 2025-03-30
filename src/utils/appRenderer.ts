
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';
import { diagnoseSyntaxError } from './syntaxChecker';
import { handleRenderError } from './errorHandlers/renderErrorHandler';

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
    
    // Check for syntax errors in critical modules
    try {
      // Get the source of App.tsx for syntax validation
      fetch('/src/App.tsx')
        .then(response => response.text())
        .then(code => {
          diagnoseSyntaxError('App.tsx', code);
        })
        .catch(error => {
          console.error('Failed to load App.tsx for syntax checking:', error);
        });
    } catch (checkError) {
      console.error('Error checking syntax:', checkError);
    }
    
    // Render the application
    createRoot(rootElement).render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    console.log('App successfully mounted');
  } catch (error) {
    handleRenderError(error);
  }
};
