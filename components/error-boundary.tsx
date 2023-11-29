import * as Sentry from '@sentry/react';
import React from 'react';
import { ClientErrorExplanations } from './error-explanations';
import { LayoutDefault } from './layouts/layout-default';

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sentry.ErrorBoundary
      fallback={
        <LayoutDefault>
          <ClientErrorExplanations />
        </LayoutDefault>
      }
      beforeCapture={(scope) => {
        scope.setLevel('fatal');
      }}
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
