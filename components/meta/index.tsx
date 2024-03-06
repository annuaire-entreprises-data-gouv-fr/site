import { Metadata } from 'next';
import { NextSeo } from 'next-seo';
import Head from 'next/head';
import React from 'react';

//@ts-ignore

type IProps = {
  title: string;
  description?: string;
  noIndex?: boolean;
  canonical?: string;
};

const SITE_NAME = 'Annuaire des Entreprises : le moteur de recherche officiel';
const SITE_DESCRIPTION =
  'L’administration permet aux particuliers et agents publics de vérifier les informations juridiques officielles d’une entreprise : SIREN, SIRET, TVA Intracommunautaire, code APE/NAF, capital social, justificatif d’immatriculation, dirigeants, convention collective…';

const SHOULD_NOT_INDEX = process.env.INDEXING_ENABLED !== 'enabled';
const OPENGRAPH_IMAGES = [
  {
    url: 'https://annuaire-entreprises.data.gouv.fr/images/linkedin.jpg',
    width: 1200,
    height: 627,
    alt: 'annuaire-entreprises.data.gouv.fr',
  },
];

const Meta: React.FC<IProps> = ({
  title = SITE_NAME,
  description = '',
  noIndex = false,
  canonical,
}) => {
  description =
    description.length > 140
      ? `${description.substring(0, 140)}…`
      : description;

  return (
    <>
      <NextSeo
        title={title ?? SITE_NAME}
        description={description ?? SITE_DESCRIPTION}
        canonical={canonical}
        openGraph={{
          ...(canonical ? { url: canonical } : {}),
          locale: 'fr_FR',
          type: 'website',
          title: title,
          description: description ?? SITE_DESCRIPTION,
          images: OPENGRAPH_IMAGES,
          site_name: SITE_NAME,
        }}
        noindex={noIndex ?? SHOULD_NOT_INDEX}
        nofollow={false}
      />
      <Head>
        <title>{title}</title>
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="Annuaire des Entreprises"
          href="https://annuaire-entreprises.data.gouv.fr/opensearch.xml"
        />

        <meta char-set="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />

        <meta name="format-detection" content="telephone=no" />

        {/* Schema.org for Google */}
        <meta itemProp="name" content={title ?? SITE_NAME} />
        <meta
          itemProp="description"
          content={description ?? SITE_DESCRIPTION}
        />
      </Head>
    </>
  );
};

export default Meta;

export function meta(obj: Metadata): Metadata {
  obj.metadataBase = new URL('https://annuaire-entreprises.data.gouv.fr');
  obj.title ??= SITE_NAME;
  obj.description ??= SITE_DESCRIPTION;
  obj.openGraph ??= {};
  obj.openGraph.title ??= obj.title;
  obj.openGraph.description ??= obj.description ?? SITE_DESCRIPTION;
  // @ts-ignore
  obj.openGraph.type ??= 'website';
  obj.openGraph.images ??= OPENGRAPH_IMAGES;
  obj.openGraph.siteName = SITE_NAME;

  if (typeof obj.alternates?.canonical === 'string') {
    obj.openGraph.url ??= obj.alternates.canonical;
  }

  obj.robots ??= {};
  if (typeof obj.robots === 'object') {
    obj.robots.follow = true;
  }

  return obj;
}
