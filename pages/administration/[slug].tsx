import { GetServerSideProps } from 'next';
import { HttpNotFound } from '#clients/exceptions';
import TextWrapper from '#components-ui/text-wrapper';
import AdministrationDescription from '#components/administrations/administration-description';
import Meta from '#components/meta';
import { administrationsMetaData } from '#models/administrations';
import { EAdministration } from '#models/administrations/EAdministration';
import { getFaqArticlesByTag, IFaqArticle } from '#models/article/faq';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  administrations: {
    long: string;
    slug: string;
  }[];
  title: string;
  articles: IFaqArticle[];
  path: string;
}

const AdministrationPage: NextPageWithLayout<IProps> = ({
  administrations,
  title,
  articles,
  path,
}) => (
  <>
    <Meta
      title={title}
      canonical={`https://annuaire-entreprises.data.gouv.fr/administration/${path}`}
    />
    <TextWrapper>
      <h1>D’où viennent les informations de cette section ?</h1>
      {administrations.map(({ slug }) => (
        <AdministrationDescription slug={slug} />
      ))}
      {articles && (
        <>
          <h2>Vous avez une questions sur ces données ?</h2>
          <ul>
            {articles.map(({ slug, title }) => (
              <li key={slug}>
                <a href={`/faq/${slug}`}>{title}</a>
              </li>
            ))}
          </ul>
          <br />
          <div>
            Vous ne trouvez pas la réponse à votre question ?{' '}
            <a href="/faq">→ voir toutes les questions fréquentes</a>
          </div>
        </>
      )}
    </TextWrapper>
  </>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    //@ts-ignore
    const slug = context.params.slug as EAdministration;
    const slugs = slug.split('_');

    const administrations = Object.values(administrationsMetaData).filter(
      //@ts-ignore
      (admin) => slugs.indexOf(admin.slug) > -1
    );
    if (administrations.length === 0) {
      throw new HttpNotFound(
        `Administration ${slugs.join(', ')} page does not exist`
      );
    }

    return {
      props: {
        administrations,
        title: administrations.map((a) => a.long).join(' et '),
        articles: getFaqArticlesByTag([...slugs, 'all']),
        path: slug,
      },
    };
  }
);

export default AdministrationPage;
