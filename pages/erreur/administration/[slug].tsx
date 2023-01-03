import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import { HttpNotFound } from '#clients/exceptions';
import AdministrationNotResponding from '#components/administration-not-responding';
import {
  administrationsMetaData,
  EAdministration,
} from '#models/administrations';
import Page from '../../../layouts';

const AdministrationError: React.FC<{ administration: EAdministration }> = ({
  administration,
}) => {
  return (
    <Page
      small={true}
      title="Cette administration ne répond pas"
      noIndex={true}
    >
      <div className="content-container">
        <h1>Le téléservice ne répond pas</h1>
        <AdministrationNotResponding
          administration={administration}
          errorType={500}
        />
      </div>
    </Page>
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
  //@ts-ignore
  const slug = params.slug as EAdministration;

  const administrationEnum = Object.keys(administrationsMetaData).find(
    //@ts-ignore
    (key) => administrationsMetaData[key].slug === slug
  );
  if (administrationEnum === undefined) {
    throw new HttpNotFound(`${slug}`);
  }

  return { props: { administration: administrationEnum } };
};

export default AdministrationError;
