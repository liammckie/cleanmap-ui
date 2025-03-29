
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { captureGlobalErrors } from './utils/errorCapture.ts'

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
          <p>Check the browser console for more details.</p>
        </div>
      `
    }
  }
}

renderApp()
