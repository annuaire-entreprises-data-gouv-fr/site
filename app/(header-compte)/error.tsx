"use client";

import {
  type NextAppError,
  useLogFatalErrorAppClient,
} from "hooks/use-log-fatal-error-app-client";
import { ClientErrorExplanations } from "#components/error-explanations";

export default function ErrorPage({ error }: { error: NextAppError }) {
  useLogFatalErrorAppClient(error);

  return <ClientErrorExplanations error={error} />;
}
