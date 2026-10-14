import { ClientErrorExplanations } from "#/components/error-explanations";
import { useLogFatalErrorAppClient } from "#/hooks/use-log-fatal-error-app-client";

export function HeaderCompteError({ error }: { error: unknown }) {
  useLogFatalErrorAppClient(error);

  return <ClientErrorExplanations error={error} />;
}
