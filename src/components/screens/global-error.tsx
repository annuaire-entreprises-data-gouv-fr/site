import { ClientErrorExplanations } from "#/components/error-explanations";
import Footer from "#/components/footer";
import { Header } from "#/components/header/header";
import { Question } from "#/components/question";
import { useLog500ErrorAppClient } from "#/hooks/use-log-fatal-error-app-client";

export function GlobalError({ error }: { error: Error }) {
  useLog500ErrorAppClient(error);
  return (
    <>
      <Header useAgentCTA={true} useSearchBar={true} />
      <main className="fr-container">
        <ClientErrorExplanations />
      </main>
      <Question />
      <Footer />
    </>
  );
}
