
import React from 'react';
import * as Sentry from '@sentry/react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RotateCcw } from 'lucide-react';

interface FallbackProps {
  error: Error;
  resetError(): void;
  eventId?: string;
}

const ErrorFallback = ({ error, resetError, eventId }: FallbackProps) => (
  <Alert variant="destructive" className="my-4">
    <AlertTitle>Something went wrong</AlertTitle>
    <AlertDescription className="mt-2">
      <div className="text-sm mb-4">
        {error.message}
        {eventId && (
          <div className="text-xs mt-2 text-gray-500">
            Error ID: {eventId}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={resetError} 
          className="flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Try again
        </Button>
        {eventId && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              Sentry.showReportDialog({ eventId });
            }}
          >
            Report feedback
          </Button>
        )}
      </div>
    </AlertDescription>
  </Alert>
);

// Ensure the ErrorFallback matches Sentry's expected type
const SentryFallback: Sentry.FallbackRender = (props) => {
  const { error, resetError, eventId } = props;
  return <ErrorFallback error={error as Error} resetError={resetError} eventId={eventId} />;
};

export const SentryErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <Sentry.ErrorBoundary fallback={SentryFallback} showDialog>
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
