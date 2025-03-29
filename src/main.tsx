
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { captureGlobalErrors } from './utils/errorCapture.ts'
import { checkSyntax, diagnoseSyntaxError } from './utils/syntaxChecker.ts'

// Set up global error capturing
captureGlobalErrors();

// Enhanced error boundary for better error reporting
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
