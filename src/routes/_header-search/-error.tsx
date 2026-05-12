import { ClientErrorExplanations } from "#/components/error-explanations";
import { useLogFatalErrorAppClient } from "#/hooks/use-log-fatal-error-app-client";

export function HeaderSearchError({ error }: { error: Error }) {
  useLogFatalErrorAppClient(error);

  return <ClientErrorExplanations error={error} />;
}
