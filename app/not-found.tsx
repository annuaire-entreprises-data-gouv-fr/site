import { ErrorNotFoundExplanations } from "#components/error-explanations";
import Footer from "#components/footer";
import { HeaderAppRouter } from "#components/header/header-app-router";
import { Question } from "#components/question";

export default function NotFound() {
  return (
    <>
      <HeaderAppRouter useAgentCTA={true} useSearchBar={true} />
      <main className="fr-container">
        <ErrorNotFoundExplanations />
      </main>
      <Question />
      <Footer />
    </>
  );
}
