import { Metadata } from 'next';
import TextWrapper from '#components-ui/text-wrapper';
import parseMarkdownSync from '#components/markdown/parse-markdown';
import StructuredDataFAQ from '#components/structured-data/faq';
import { allDataToModify } from '#models/administrations/data-to-modify';
import { allFaqArticles } from '#models/article/faq';

export default function FAQPage() {
  const articles = allFaqArticles;

  return (
    <>
      <StructuredDataFAQ
        data={articles.map(({ title, body }) => [
          title,
          parseMarkdownSync(body).html,
        ])}
      />
      <TextWrapper>
        <h1>Réponses à vos questions (FAQ) :</h1>
        <ul>
          {articles.map(({ slug, title }) => (
            <li key={slug}>
              <a href={`/faq/${slug}`}>{title}</a>
            </li>
          ))}
        </ul>
        <h2>Comment modifier les informations d’une entreprise ?</h2>
        <ul>
          {allDataToModify.map(({ label, slug }) => (
            <li key={slug}>
              <a href={`/faq/modifier/${slug}`}>{label}</a>
            </li>
          ))}
        </ul>
      </TextWrapper>
    </>
  );
}

export const metadata: Metadata = {
  title: 'FAQ de l’Annuaire des Entreprises',
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/faq',
  },
  robots: 'index, follow',
};
