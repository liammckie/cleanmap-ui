
import { initSentry } from './utils/sentryInit';
import { captureGlobalErrors } from './utils/errors/globalErrorHandlers';
import { checkViteClientCompatibility, diagnoseViteClientIssues } from './utils/browserInfo';
import { setupMockEmployeeApi } from './utils/employeeDebug';
import { setupConsoleErrorCapture, simulateBuildErrorCapture } from './utils/buildErrorCapture';
import { setupViteErrorHandler } from './utils/errorHandlers/viteErrorHandler';
import { renderApp } from './utils/appRenderer';
import { handleFatalError } from './utils/errorHandlers/renderErrorHandler';
import './index.css';

// Initialize Sentry right away
initSentry();

// Set up global error capturing
captureGlobalErrors();

// Set up console error capturing for build errors
setupConsoleErrorCapture();

// Initialize mock API in development mode
if (process.env.NODE_ENV === 'development') {
  setupMockEmployeeApi();
  
  // In development mode, simulate build error capture for testing purposes
  setTimeout(() => {
    simulateBuildErrorCapture();
  }, 5000);
}

// Check Vite client compatibility before starting
console.log('Checking Vite client compatibility:', checkViteClientCompatibility());

// Add diagnostic for Vite client issues
diagnoseViteClientIssues();

// Set up Vite-specific error handler
setupViteErrorHandler();

// Add another safety wrapper to catch very early errors
try {
  renderApp();
} catch (fatalError) {
  handleFatalError(fatalError);
}
