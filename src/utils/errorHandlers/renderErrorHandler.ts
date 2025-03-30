
import { checkSyntax } from "../syntaxChecker";

/**
 * Display error UI when app rendering fails
 */
export const handleRenderError = (error: unknown): void => {
  console.error("Failed to render application:", error);
  
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: sans-serif;">
        <h2>Application Error</h2>
        <p>Sorry, something went wrong while loading the application.</p>
        <p>Error type: ${error instanceof SyntaxError ? "Syntax Error" : error instanceof TypeError ? "Type Error" : "Unknown Error"}</p>
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
    `;
    
    // Set up diagnostic button
    setupDiagnosticButton();
  }
};

/**
 * Set up the diagnostic button behavior
 */
const setupDiagnosticButton = (): void => {
  const debugBtn = document.getElementById("debugBtn");
  if (debugBtn) {
    debugBtn.addEventListener("click", () => {
      const resultsDiv = document.getElementById("diagnosticResults");
      if (resultsDiv) {
        resultsDiv.innerHTML = "<p>Running diagnostics...</p>";
        
        // List of potential problem files to check
        const filesToCheck = [
          "/src/App.tsx",
          "/src/main.tsx",
          "/index.html"
        ];
        
        Promise.all(filesToCheck.map(file => 
          fetch(file)
            .then(response => response.text())
            .then(code => ({ file, error: checkSyntax(code) }))
            .catch(err => ({ file, error: `Failed to load: ${err.message}` }))
        )).then(results => {
          let html = "<h3>Diagnostic Results:</h3><ul>";
          
          results.forEach(({ file, error }) => {
            html += `<li>${file}: ${error ? `<span style="color: red">✘ ${error}</span>` : '<span style="color: green">✓ No syntax errors</span>'}</li>`;
          });
          
          html += "</ul><p>For more details, open your browser's developer console (F12)</p>";
          
          if (resultsDiv) {
            resultsDiv.innerHTML = html;
          }
        });
      }
    });
  }
};

/**
 * Handle critical application errors
 */
export const handleFatalError = (error: unknown): void => {
  console.error("Fatal application error:", error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif;">
      <h2>Critical Application Error</h2>
      <p>The application could not start due to a fatal error.</p>
      <pre style="background: #f5f5f5; padding: 10px; border-radius: 4px; overflow: auto;">
        ${error instanceof Error ? error.stack || error.message : String(error)}
      </pre>
    </div>
  `;
};
