
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'

// Add error boundary for better error reporting
const renderApp = () => {
  try {
    const rootElement = document.getElementById('root')
    if (!rootElement) {
      console.error('Root element not found')
      return
    }
    
    createRoot(rootElement).render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    console.log('App successfully mounted')
  } catch (error) {
    console.error('Failed to render application:', error)
    // Display fallback UI with error information
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif;">
          <h2>Application Error</h2>
          <p>Sorry, something went wrong while loading the application.</p>
          <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">
            ${error instanceof Error ? error.stack || error.message : String(error)}
          </pre>
        </div>
      `
    }
  }
}

renderApp()
