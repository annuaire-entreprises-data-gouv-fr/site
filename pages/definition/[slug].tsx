import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import Breadcrumb from '#components-ui/breadcrumb';
import ButtonLink from '#components-ui/button';
import TextWrapper from '#components-ui/text-wrapper';
import Meta from '#components/meta';
import { NextPageWithLayout } from 'pages/_app';
import {
  IDefinition,
  allDefinitions,
  getDefinition,
} from '#models/definitions';

const DefinitionPage: NextPageWithLayout<{ definition: IDefinition }> = ({
  definition,
}) => (
  <>
    <Meta
      title={definition.seo.title || definition.title}
      description={definition.seo.description}
      noIndex={false}
      canonical={`https://annuaire-entreprises.data.gouv.fr/faq/${definition.slug}`}
    />
    <TextWrapper>
      <Breadcrumb
        links={[
          { href: '/definition/liste', label: 'Définitions' },
          { href: '', label: definition.title },
        ]}
      />
      <h1 className="definition-title">{definition.title}</h1>
      <ReactMarkdown>{definition.body}</ReactMarkdown>
      {definition.cta ? (
        <div className="layout-left">
          <ButtonLink to={definition.cta.to}>{definition.cta.label}</ButtonLink>
        </div>
      ) : null}
      {definition.more ? (
        <div>
          <h2>Sur le même sujet</h2>
          <ul>
            {definition.more.map(({ href, label }) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </TextWrapper>
  </>
);

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: allDefinitions.map(({ slug }) => {
      return {
        params: {
          slug,
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const definition = getDefinition(slug);
  return {
    props: {
      definition,
    },
  };
};

export default DefinitionPage;
