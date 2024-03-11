import { Metadata } from 'next';
import { EQuestionType } from '#components/faq-parcours/question';
import ParcoursQuestions from './_components/parcours-questions';

export const metadata: Metadata = {
  title: 'FAQ interactive de l’Annuaire des Entreprises',
  robots: 'index, follow',
  alternates: {
    canonical: `https://annuaire-entreprises.data.gouv.fr/faq/parcours`,
  },
};

export default function Parcours({
  searchParams,
}: {
  searchParams?: { question?: string };
}) {
  const question = (searchParams?.question ?? '') as EQuestionType;

  return (
    <>
      <h1>Bonjour, comment pouvons-nous vous aider ?</h1>
      <p>Pour commencer, faisons connaissance :</p>
      <strong>Qui êtes-vous ?</strong>
      <ParcoursQuestions question={question} />
      <div style={{ marginTop: '200px' }} />
    </>
  );
}
