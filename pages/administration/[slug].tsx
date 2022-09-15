import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';

import {
  administrationsMetaData,
  EAdministration,
} from '../../models/administrations';
import { HttpNotFound } from '../../clients/exceptions';
import AdministrationDescription from '../../components/administrations/administration-description';
import HiddenH1 from '../../components/a11y-components/hidden-h1';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '../../utils/server-side-props-helper/post-server-side-props';
import { getFaqArticlesByTag, IArticle } from '../../models/faq';

interface IProps extends IPropsWithMetadata {
  long: string;
  slug: string;
  articles: IArticle[];
}

const AdministrationPage: React.FC<IProps> = ({
  long,
  slug,
  metadata,
  articles,
}) => (
  <Page
    small={true}
    title={long}
    canonical={`https://annuaire-entreprises.data.gouv.fr/sources-de-donnees/${slug}`}
    isBrowserOutdated={metadata.isBrowserOutdated}
  >
    <div className="content-container">
      <HiddenH1 title={long} />
      <br />
      <a href="/administration">← Toutes les administrations partenaires</a>
      <AdministrationDescription slug={slug} />
      {articles && (
        <>
          <h2>Questions fréquentes</h2>
          {articles.map(({ slug, title }) => (
            <a href={slug}>{title}</a>
          ))}
        </>
      )}
    </div>
    <style jsx>{`
      .content-container {
        margin: 20px auto 40px;
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    //@ts-ignore
    const slug = context.params.slug as EAdministration;

    const administration = Object.values(administrationsMetaData).find(
      //@ts-ignore
      (admin) => admin.slug === slug
    );
    if (administration === undefined) {
      throw new HttpNotFound(`Administration ${slug} page does not exist`);
    }

    return {
      props: {
        ...administration,
        articles: getFaqArticlesByTag([slug, 'all']),
      },
    };
  }
);

export default AdministrationPage;
