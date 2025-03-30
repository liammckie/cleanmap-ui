import * as Sentry from "@sentry/react";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Fallback = () => (
  <div className="p-6 text-red-600 text-center">
    <h2>Something went wrong.</h2>
    <p>We're working on it.</p>
  </div>
);

export const SentryErrorBoundary = ({ children }: Props) => {
  return (
    <Sentry.ErrorBoundary fallback={<Fallback />} showDialog>
      {children}
    </Sentry.ErrorBoundary>
  );
};
