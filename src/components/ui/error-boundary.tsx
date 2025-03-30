
import React from 'react';
import * as Sentry from '@sentry/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RotateCcw } from 'lucide-react';

interface FallbackProps {
  error: Error;
  resetError(): void;
}

const ErrorFallback = ({ error, resetError }: FallbackProps) => (
  <Alert variant="destructive" className="my-4">
    <AlertTitle>Something went wrong</AlertTitle>
    <AlertDescription className="mt-2">
      <div className="text-sm mb-4">
        {error.message}
      </div>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={resetError} 
        className="flex items-center gap-2"
      >
        <RotateCcw className="h-4 w-4" />
        Try again
      </Button>
    </AlertDescription>
  </Alert>
);

// Ensure the ErrorFallback matches Sentry's expected type
const SentryFallback: Sentry.FallbackRender = (props) => {
  const { error, resetError } = props;
  return <ErrorFallback error={error as Error} resetError={resetError} />;
};

export const SentryErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <Sentry.ErrorBoundary fallback={SentryFallback}>
    {children}
  </Sentry.ErrorBoundary>
);

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> => {
  const WithErrorBoundary: React.FC<P> = (props) => (
    <SentryErrorBoundary>
      <Component {...props} />
    </SentryErrorBoundary>
  );
  
  const displayName = Component.displayName || Component.name || 'Component';
  WithErrorBoundary.displayName = `withErrorBoundary(${displayName})`;
  
  return WithErrorBoundary;
};
