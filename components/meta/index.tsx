import React from 'react';
import Head from 'next/head';

//@ts-ignore

import { NextSeo } from 'next-seo';

interface IProps {
  title: string;
  description?: string;
  noIndex?: boolean;
  canonical?: string;
}

const SITE_NAME = 'annuaire-entreprises.data.gouv.fr';
const SITE_URL =
  process.env.SITE_URL || 'https://annuaire-entreprises.data.gouv.fr';
const SITE_DESCRIPTION =
  'Recherchez une entreprise par son nom, son sigle, son SIRET et accédez à ses informations publiques détenues par l’administration';

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
              alt: 'api.gouv.fr',
            },
          ],
          site_name: SITE_NAME,
        }}
      />
      <Head>
        {/* weird stuff going on with jsx and my kitchen recipe in _document
          the second {''} seems to be required
        */}

        <title>
          {title}

          {''}
        </title>

        {/* custom no index as NextSEO noindex was broken */}
        {noIndex && (
          <>
            <meta name="robots" content="noindex" />
            <meta name="googlebot" content="noindex" />
          </>
        )}

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
