import { HttpNotFound } from '#clients/exceptions';
import AdministrationNotResponding from '#components/administration-not-responding';
import Meta from '#components/meta/meta-client';
import { administrationsMetaData } from '#models/administrations';
import { EAdministration } from '#models/administrations/EAdministration';
import { GetStaticPaths, GetStaticProps } from 'next';
import { NextPageWithLayout } from 'pages/_app';

const AdministrationError: NextPageWithLayout<{
  administration: EAdministration;
}> = ({ administration }) => {
  return (
    <>
      <Meta title="Cette administration ne répond pas" />
      <div className="content-container">
        <h1>Le téléservice ne répond pas</h1>
        <AdministrationNotResponding
          administration={administration}
          errorType={500}
        />
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: Object.values(administrationsMetaData).map((admin) => {
      return {
        params: {
          slug: admin.slug,
        },
      };
    }),
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as EAdministration;

  const administrationEnum = Object.keys(administrationsMetaData).find(
    (key) => administrationsMetaData[key].slug === slug
  );
  if (administrationEnum === undefined) {
    throw new HttpNotFound(`${slug}`);
  }

  return { props: { administration: administrationEnum } };
};

export default AdministrationError;
