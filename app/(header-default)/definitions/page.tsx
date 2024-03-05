import { Metadata } from 'next';
import TextWrapper from '#components-ui/text-wrapper';
import parseMarkdownSync from '#components/markdown/parse-markdown';
import StructuredDataFAQ from '#components/structured-data/faq';
import { allDefinitions } from '#models/article/definitions';

export default function AllDefinitionsPage() {
  const definitions = allDefinitions;
  return (
    <>
      <StructuredDataFAQ
        data={definitions.map(({ title, body }) => [
          title,
          parseMarkdownSync(body).html,
        ])}
      />
      <TextWrapper>
        <h1>Définitions</h1>
        <ul>
          {definitions.map(({ slug, title }) => (
            <li key={slug}>
              <a
                href={`/definitions/${slug}`}
                aria-label={title + ', voir la définition'}
              >
                {title}
              </a>
            </li>
          ))}
        </ul>
      </TextWrapper>
    </>
  );
}

export const metadata: Metadata = {
  title: "Definitions des termes utilisées sur l'Annuaire des Entreprises",
  alternates: {
    canonical: 'https://annuaire-entreprises.data.gouv.fr/definitions',
  },
};
