import { EQuestionType } from '#components/faq-parcours/question';
import getSession from '#utils/server-side-helper/app/get-session';
import { Metadata } from 'next';
import ParcoursQuestions from './_components/parcours-questions';

export const metadata: Metadata = {
  title: 'FAQ interactive de l’Annuaire des Entreprises',
  robots: 'index, follow',
  alternates: {
    canonical: `https://annuaire-entreprises.data.gouv.fr/faq/parcours`,
  },
};

type SearchParams = Promise<{ question?: string }>;

export default async function Parcours(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;

  const question = (searchParams?.question ?? '') as EQuestionType;
  const session = await getSession();

  return (
    <>
      <h1>Bonjour, comment pouvons-nous vous aider ?</h1>
      <p>Pour commencer, faisons connaissance :</p>
      <strong>Qui êtes-vous ?</strong>
      <ParcoursQuestions session={session} question={question} />
      <div style={{ marginTop: '200px' }} />
    </>
  );
}
