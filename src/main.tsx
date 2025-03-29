
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { captureGlobalErrors } from './utils/errorCapture.ts'

// Set up global error capturing
captureGlobalErrors();

// Create a simple diagnostic function that doesn't depend on other modules
const simpleDiagnostics = {
  checkViteClient: () => {
    try {
      return {
        hasViteGlobals: typeof (window as any).__vite_plugin_react_preamble_installed__ !== 'undefined',
        hasHMR: typeof (import.meta as any).hot !== 'undefined',
        userAgent: navigator.userAgent,
        scripts: Array.from(document.querySelectorAll('script')).map(s => s.src || 'inline')
      };
    } catch (e) {
      return { error: String(e) };
    }
  }
};

// Wrap application rendering in a try-catch to handle syntax errors
const renderApp = () => {
  try {
    console.log('Starting to render application...');
    
    const rootElement = document.getElementById('root');
    if (!rootElement) {
      console.error('Root element not found');
      return;
    }

    // Add specific error handler for Vite-related issues
    window.addEventListener('error', (event) => {
      if (event.filename?.includes('@vite') || event.message?.includes('Vite')) {
        console.error('Vite-related error detected:', event);
        
        // Try to inspect the specific error type
        if (event.message?.includes('SyntaxError') && event.filename?.includes('@vite/client')) {
          console.error('Syntax error in Vite client. This is likely due to a CSP issue.');
          console.info('Check that your Content-Security-Policy allows:');
          console.info('1. unsafe-eval for script-src');
          console.info('2. unsafe-inline for script-src');
          console.info('3. ws: and wss: for connect-src');
        }
        
        return false; // Allow other handlers to process this error
      }
    }, true);
    
    // Render the app
    createRoot(rootElement).render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    
    console.log('App successfully mounted');
  } catch (error) {
    console.error('Failed to render application:', error);
    
    // Display improved fallback UI with more error information
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif;">
          <h2>Application Error</h2>
          <p>Sorry, something went wrong while loading the application.</p>
          <p>Error type: ${error instanceof SyntaxError ? 'Syntax Error' : error instanceof TypeError ? 'Type Error' : 'Unknown Error'}</p>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; margin-bottom: 15px;">
            ${error instanceof Error ? error.stack || error.message : String(error)}
          </pre>
          <div style="margin-top: 15px; padding: 10px; background: #f0f8ff; border-left: 4px solid #0066cc; margin-bottom: 15px;">
            <strong>Vite Client Status:</strong>
            <pre style="margin: 5px 0 0 0; font-size: 12px;">${JSON.stringify(simpleDiagnostics.checkViteClient(), null, 2)}</pre>
          </div>
          <p>Check the browser console for more details.</p>
          <button onclick="window.location.reload()" style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
          <button onclick="window.location.href = window.location.href + '?plain=true'" style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
            Try without HMR
          </button>
        </div>
      `;
    }
  }
};

// Check if we should try to use the plain mode without Vite HMR
if (window.location.search.includes('plain=true')) {
  console.log('Running in plain mode without HMR');
  // In plain mode, we just render the app directly
  renderApp();
} else {
  // Add another safety wrapper to catch very early errors
  try {
    renderApp();
  } catch (fatalError) {
    console.error('Fatal application error:', fatalError);
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h2>Critical Application Error</h2>
        <p>The application could not start due to a fatal error.</p>
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">
          ${fatalError instanceof Error ? fatalError.stack || fatalError.message : String(fatalError)}
        </pre>
        <button onclick="window.location.reload()" style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 15px;">
          Refresh Page
        </button>
        <button onclick="window.location.href = window.location.href + '?plain=true'" style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 10px;">
          Try without HMR
        </button>
      </div>
    `;
  }
}
