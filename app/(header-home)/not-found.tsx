import { ErrorNotFoundExplanations } from "#components/error-explanations";
import Footer from "#components/footer";
import { Question } from "#components/question";

export default function NotFound() {
  return (
    <>
      <ErrorNotFoundExplanations />
      <Question />
      <Footer />
    </>
  );
}
