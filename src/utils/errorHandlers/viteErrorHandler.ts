
/**
 * Handles Vite-specific errors that might occur during development
 */
export const setupViteErrorHandler = (): void => {
  window.addEventListener("error", (event) => {
    if (event.filename?.includes("@vite") || event.message?.includes("Vite")) {
      console.error("Vite-related error detected:", event);
      
      // Additional debugging info for Vite client errors
      console.info("Vite client error details:", {
        filename: event.filename,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        message: event.message,
        stack: event.error?.stack,
      });
      
      // Try to inspect the specific error type
      if (event.message?.includes("SyntaxError") && event.filename?.includes("@vite/client")) {
        console.error("Syntax error in Vite client. This is likely due to a CSP issue.");
        console.info("Check that your Content-Security-Policy allows:");
        console.info("1. unsafe-eval for script-src");
        console.info("2. unsafe-inline for script-src");
        console.info("3. ws: and wss: for connect-src");
      }
      
      // Display error UI
      showViteErrorUI(event.message);
    }
  }, true);
};

/**
 * Displays a user-friendly error UI for Vite errors
 */
export const showViteErrorUI = (errorMessage: string): void => {
  const rootElement = document.getElementById("root");
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
        <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">${errorMessage}</pre>
        <button id="refreshBtn" style="margin-top: 15px; padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
          Refresh Page
        </button>
      </div>
    `;
    
    // Add click handler for the refresh button
    const refreshBtn = document.getElementById("refreshBtn");
    if (refreshBtn) {
      refreshBtn.addEventListener("click", () => {
        window.location.reload();
      });
    }
  }
};
