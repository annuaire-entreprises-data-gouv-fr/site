import { GetStaticProps } from 'next';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReactMarkdown from 'react-markdown';
import TextWrapper from '#components-ui/text-wrapper';
import Meta from '#components/meta';
import StructuredDataFAQ from '#components/structured-data/faq';
import { NextPageWithLayout } from 'pages/_app';
import { IDefinition, allDefinitions } from '#models/definitions';

const AllDefinitionsPage: NextPageWithLayout<{
  definitions: IDefinition[];
}> = ({ definitions }) => (
  <>
    <Meta
      title="Definitions des termes utilisées sur l'Annuaire des Entreprises"
      canonical="https://annuaire-entreprises.data.gouv.fr/definitions"
    />
    <StructuredDataFAQ
      data={definitions.map(({ title, body }) => [
        title,
        renderToStaticMarkup(<ReactMarkdown>{body}</ReactMarkdown>),
      ])}
    />
    <TextWrapper>
      <h1>Définitions</h1>
      <ul>
        {definitions.map(({ slug, title }) => (
          <li key={slug}>
            <a href={`/definitions/${slug}`} aria-label={title+', voir la définition'}>{title}</a>
          </li>
        ))}
      </ul>
    </TextWrapper>
  </>
);

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      definitions: allDefinitions,
    },
  };
};

export default AllDefinitionsPage;
