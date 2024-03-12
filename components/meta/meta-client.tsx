import { NextSeo } from 'next-seo';
import Head from 'next/head';
import {
  OPENGRAPH_IMAGES,
  SHOULD_NOT_INDEX,
  SITE_DESCRIPTION,
  SITE_NAME,
} from '.';

type IProps = {
  title: string;
  description?: string;
  noIndex?: boolean;
  canonical?: string;
};

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
