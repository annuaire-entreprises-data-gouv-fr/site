import { ErrorNotFoundExplanations } from '#components/error-explanations';
import Footer from '#components/footer';
import { HeaderServer } from '#components/header/header-server';
import QuestionOrFeedback from './_component/question-or-feedback';

export default function NotFound() {
  return (
    <>
      <HeaderServer useSearchBar={true} useAgentCTA={true} />
      <main className="fr-container">
        <ErrorNotFoundExplanations />
      </main>
      <QuestionOrFeedback session={null} />
      <Footer />
    </>
  );
}
