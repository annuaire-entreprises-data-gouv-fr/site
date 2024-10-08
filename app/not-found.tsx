import { ErrorNotFoundExplanations } from '#components/error-explanations';
import Footer from '#components/footer';
import { HeaderAppRouter } from '#components/header/header-app-router';
import QuestionOrFeedback from './_component/question-or-feedback';

export default function NotFound() {
  return (
    <>
      <HeaderAppRouter useSearchBar={true} useAgentCTA={true} />
      <main className="fr-container">
        <ErrorNotFoundExplanations />
      </main>
      <QuestionOrFeedback session={null} />
      <Footer />
    </>
  );
}
