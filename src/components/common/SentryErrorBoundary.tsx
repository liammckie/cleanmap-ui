
import * as Sentry from "@sentry/react";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  children: ReactNode;
};

const Fallback = ({ eventId }: { eventId?: string }) => {
  const [showDetails, setShowDetails] = useState(false);

  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-[50vh] p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="bg-red-50 dark:bg-red-900/20">
          <CardTitle className="text-red-600 dark:text-red-400">Something went wrong</CardTitle>
          <CardDescription>
            We've encountered an unexpected error and our team has been notified.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-4">
            Try refreshing the page or going back to the previous page to continue working.
          </p>
          
          {eventId && (
            <div className="my-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setShowDetails(!showDetails)}
                className="mb-2"
              >
                {showDetails ? "Hide Technical Details" : "Show Technical Details"}
              </Button>
              
              {showDetails && (
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs font-mono overflow-x-auto">
                  <p>Error Reference: {eventId}</p>
                  <p className="mt-1 text-gray-500">
                    Please share this reference ID if you contact support about this issue.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button onClick={reloadPage}>
            Reload Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export const SentryErrorBoundary = ({ children }: Props) => {
  return (
    <Sentry.ErrorBoundary 
      fallback={({ eventId }) => <Fallback eventId={eventId} />} 
      showDialog={import.meta.env.PROD}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};
