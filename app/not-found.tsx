import { ErrorNotFoundExplanations } from "#components/error-explanations";
import Footer from "#components/footer";
import { Header } from "#components/header/header";
import { Question } from "#components/question";

export default function NotFound() {
  return (
    <>
      <Header useAgentCTA={true} useSearchBar={true} />
      <main className="fr-container">
        <ErrorNotFoundExplanations />
      </main>
      <Question />
      <Footer />
    </>
  );
}
