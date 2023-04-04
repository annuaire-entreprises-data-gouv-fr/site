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
const SITE_URL =
  process.env.SITE_URL || 'https://annuaire-entreprises.data.gouv.fr';
const SITE_DESCRIPTION =
  'L’administration permet aux particuliers et agents publics de vérifier les informations juridiques officielles d’une entreprise : SIREN, SIRET, TVA Intracommunautaire, code APE/NAF, capital social, justificatif d’immatriculation, dirigeants, convention collective…';

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
        title={title || SITE_NAME}
        description={description || SITE_DESCRIPTION}
        canonical={canonical}
        openGraph={{
          url: SITE_URL,
          locale: 'fr_FR',
          title: title,
          description: description || SITE_DESCRIPTION,
          images: [
            {
              url: '/images/linkedin.jpg',
              width: 1200,
              height: 627,
              alt: 'annuaire-entreprises.data.gouv.fr',
            },
          ],
          site_name: SITE_NAME,
        }}
        noindex={noIndex}
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

        {/* Search Engine */}
        <meta name="description" content={description || SITE_DESCRIPTION} />
        <meta name="image" content="/images/api.gouv.fr.svg" />

        {/* Schema.org for Google */}
        <meta itemProp="name" content={title || SITE_NAME} />
        <meta
          itemProp="description"
          content={description || SITE_DESCRIPTION}
        />
      </Head>
    </>
  );
};

export default Meta;
