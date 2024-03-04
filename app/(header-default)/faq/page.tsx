import { Metadata } from 'next';
import TextWrapper from '#components-ui/text-wrapper';
import parseMarkdownSync from '#components/markdown/parse-markdown';
import StructuredDataFAQ from '#components/structured-data/faq';
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
      </TextWrapper>
    </>
  );
}

export const metadata: Metadata = {
  title: "FAQ de l'Annuaire des Entreprises",
  canonical: 'https://annuaire-entreprises.data.gouv.fr/faq',
};
