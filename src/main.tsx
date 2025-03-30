
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { initSentry } from './utils/sentryInit'
import { captureGlobalErrors } from './utils/errors/globalErrorHandlers'
import { checkSyntax, diagnoseSyntaxError } from './utils/syntaxChecker.ts'
import { checkViteClientCompatibility, diagnoseViteClientIssues } from './utils/browserInfo.ts'
import { setupMockEmployeeApi } from './utils/employeeDebug.ts'
import { setupConsoleErrorCapture, simulateBuildErrorCapture } from './utils/buildErrorCapture.ts'

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
  // This would be removed in production and replaced with actual build process integration
  setTimeout(() => {
    simulateBuildErrorCapture();
  }, 5000);
}

// Check Vite client compatibility before starting
console.log('Checking Vite client compatibility:', checkViteClientCompatibility());

// Add diagnostic for Vite client issues
diagnoseViteClientIssues();

// Add specific error handler for Vite-related issues
window.addEventListener('error', (event) => {
  if (event.filename?.includes('@vite') || event.message?.includes('Vite')) {
    console.error('Vite-related error detected:', event);
    
    // Additional debugging info for Vite client errors
    console.info('Vite client error details:', {
      filename: event.filename,
      lineNumber: event.lineno,
      columnNumber: event.colno,
      message: event.message,
      stack: event.error?.stack,
    });
    
    // Try to inspect the specific error type
    if (event.message?.includes('SyntaxError') && event.filename?.includes('@vite/client')) {
      console.error('Syntax error in Vite client. This is likely due to a CSP issue.');
      console.info('Check that your Content-Security-Policy allows:');
      console.info('1. unsafe-eval for script-src');
      console.info('2. unsafe-inline for script-src');
      console.info('3. ws: and wss: for connect-src');
    }
    
    const rootElement = document.getElementById('root');
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif;">
          <h2>Development Environment Error</h2>
          <p>There was an error with the Vite development server.</p>
          <p>This is likely caused by Content Security Policy restrictions.</p>
          <p>Try one of these solutions:</p>
          <ul>
            <li>Refresh the page</li>
            <li>Restart the development server</li>
            <li>Check browser console for specific errors</li>
            <li>Verify that your Content Security Policy allows 'unsafe-eval' and WebSocket connections</li>
          </ul>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">${event.message}</pre>
          <button id="refreshBtn" style="margin-top: 15px; padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
      
      // Add click handler for the refresh button
      const refreshBtn = document.getElementById('refreshBtn');
      if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
          window.location.reload();
        });
      }
    }
  }
}, true);

const renderApp = () => {
  try {
    const rootElement = document.getElementById('root')
    if (!rootElement) {
      console.error('Root element not found')
      return
    }
    
    // Try to identify any syntax errors in the App component
    console.log('Starting to render application...')
    
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
    
    createRoot(rootElement).render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    console.log('App successfully mounted')
  } catch (error) {
    console.error('Failed to render application:', error)
    
    // Display improved fallback UI with more error information
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif;">
          <h2>Application Error</h2>
          <p>Sorry, something went wrong while loading the application.</p>
          <p>Error type: ${error instanceof SyntaxError ? 'Syntax Error' : error instanceof TypeError ? 'Type Error' : 'Unknown Error'}</p>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto; margin-bottom: 15px;">
            ${error instanceof Error ? error.stack || error.message : String(error)}
          </pre>
          <p>If this is a syntax error, check for:</p>
          <ul>
            <li>Missing or extra brackets, braces, or parentheses</li>
            <li>Unclosed string literals or template literals</li>
            <li>Invalid JSX syntax</li>
            <li>Unexpected characters in the code</li>
          </ul>
          <button id="debugBtn" style="padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
            Run Diagnostic
          </button>
          <div id="diagnosticResults" style="margin-top: 20px;"></div>
          <p>Check the browser console for more details.</p>
        </div>
      `
      
      // Add event listener to debug button
      const debugBtn = document.getElementById('debugBtn')
      if (debugBtn) {
        debugBtn.addEventListener('click', () => {
          const resultsDiv = document.getElementById('diagnosticResults')
          if (resultsDiv) {
            resultsDiv.innerHTML = '<p>Running diagnostics...</p>'
            
            // List of potential problem files to check
            const filesToCheck = [
              '/src/App.tsx',
              '/src/main.tsx',
              '/index.html'
            ]
            
            Promise.all(filesToCheck.map(file => 
              fetch(file)
                .then(response => response.text())
                .then(code => ({ file, error: checkSyntax(code) }))
                .catch(err => ({ file, error: `Failed to load: ${err.message}` }))
            )).then(results => {
              let html = '<h3>Diagnostic Results:</h3><ul>'
              
              results.forEach(({ file, error }) => {
                html += `<li>${file}: ${error ? `<span style="color: red">✘ ${error}</span>` : '<span style="color: green">✓ No syntax errors</span>'}</li>`
              })
              
              html += '</ul><p>For more details, open your browser\'s developer console (F12)</p>'
              
              if (resultsDiv) {
                resultsDiv.innerHTML = html
              }
            })
          }
        })
      }
    }
  }
}

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
    </div>
  `;
}
