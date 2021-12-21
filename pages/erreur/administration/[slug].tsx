import React from 'react';
import { GetStaticPaths, GetStaticProps } from 'next';

import Page from '../../../layouts';
import {
  administrationsMetaData,
  EAdministration,
} from '../../../models/administration';
import { HttpNotFound } from '../../../clients/exceptions';
import AdministrationNotResponding from '../../../components/administration-not-responding';

const AdministrationError: React.FC<{ administration: EAdministration }> = ({
  administration,
}) => {
  return (
    <Page title="Cette administration ne répond pas" noIndex={true}>
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
    throw new HttpNotFound(404, `${slug}`);
  }

  return { props: { administration: administrationEnum } };
};

export default AdministrationError;
