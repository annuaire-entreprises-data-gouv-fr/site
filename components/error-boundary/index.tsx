import * as Sentry from "@sentry/react";
import type React from "react";
import { ClientErrorExplanations } from "../error-explanations";
import { LayoutDefault } from "../layouts/layout-default";

export default function ErrorBoundary({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Sentry.ErrorBoundary
      beforeCapture={(scope) => {
        scope.setLevel("fatal");
      }}
      fallback={
        <LayoutDefault>
          <ClientErrorExplanations />
        </LayoutDefault>
      }
    >
      {children}
    </Sentry.ErrorBoundary>
  );
}
