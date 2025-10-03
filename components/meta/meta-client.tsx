import Head from "next/head";
import { NextSeo } from "next-seo";
import {
  OPENGRAPH_IMAGES,
  SHOULD_NOT_INDEX,
  SITE_DESCRIPTION,
  SITE_NAME,
} from ".";

type IProps = {
  title: string;
  description?: string;
  noIndex?: boolean;
  canonical?: string;
};

const Meta: React.FC<IProps> = ({
  title = SITE_NAME,
  description = "",
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
        canonical={canonical}
        description={description ?? SITE_DESCRIPTION}
        nofollow={false}
        noindex={noIndex ?? SHOULD_NOT_INDEX}
        openGraph={{
          ...(canonical ? { url: canonical } : {}),
          locale: "fr_FR",
          type: "website",
          title: title,
          description: description ?? SITE_DESCRIPTION,
          images: OPENGRAPH_IMAGES,
          site_name: SITE_NAME,
        }}
        title={title ?? SITE_NAME}
      />
      <Head>
        <title>{title}</title>
        <link
          href="https://annuaire-entreprises.data.gouv.fr/opensearch.xml"
          rel="search"
          title="Annuaire des Entreprises"
          type="application/opensearchdescription+xml"
        />

        <meta char-set="utf-8" />
        <meta
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
          name="viewport"
        />

        <meta content="telephone=no" name="format-detection" />

        {/* Schema.org for Google */}
        <meta content={title ?? SITE_NAME} itemProp="name" />
        <meta
          content={description ?? SITE_DESCRIPTION}
          itemProp="description"
        />
      </Head>
    </>
  );
};

export default Meta;
