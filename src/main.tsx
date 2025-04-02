
import { BrowserRouter } from 'react-router-dom';
import { initSentry } from './utils/sentryInit';
import { captureGlobalErrors } from './utils/errors/globalErrorHandlers';
import { checkViteClientCompatibility, diagnoseViteClientIssues } from './utils/browserInfo';
import { setupConsoleErrorCapture } from './utils/buildErrorCapture';
import { setupViteErrorHandler } from './utils/errorHandlers/viteErrorHandler';
import { handleFatalError } from './utils/errorHandlers/renderErrorHandler';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize Sentry right away
initSentry();

// Set up global error capturing
captureGlobalErrors();

// Set up console error capture for build errors
setupConsoleErrorCapture();

// Check Vite client compatibility before starting
console.log('Checking Vite client compatibility:', checkViteClientCompatibility());

// Add diagnostic for Vite client issues
diagnoseViteClientIssues();

// Set up Vite-specific error handler
setupViteErrorHandler();

// Custom renderApp function
const renderApp = () => {
  const container = document.getElementById('root');
  if (!container) {
    throw new Error('Root element not found');
  }
  
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

// Add another safety wrapper to catch very early errors
try {
  renderApp();
} catch (fatalError) {
  handleFatalError(fatalError);
}
