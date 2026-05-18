import { ClientErrorExplanations } from "#/components/error-explanations";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import { useLogFatalErrorAppClient } from "#/hooks/use-log-fatal-error-app-client";

export function HeaderSearchError({ error }: { error: Error }) {
  useLogFatalErrorAppClient(error);

  return (
    <>
      <Header useAgentCTA={true} useMap={false} useSearchBar={true} />
      <main className="fr-container">
        <ClientErrorExplanations error={error} />
      </main>
      <Footer />
    </>
  );
}
