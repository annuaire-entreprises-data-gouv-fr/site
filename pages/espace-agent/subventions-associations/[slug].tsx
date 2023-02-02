import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react';
import { clientApiEntrepriseAssociation } from '#clients/api-entreprise/association';
import { Loader } from '#components-ui/loader';
import Meta from '#components/meta';
import { ProtectedSection } from '#components/section/protected-section';
import Title, { FICHE } from '#components/title-section';
import { IUniteLegale } from '#models/index';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  IPropsWithMetadata,
  postServerSideProps,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isLoggedIn } from '#utils/session';
import { NextPageWithLayout } from 'pages/_app';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
}

const OctroiPage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  metadata: { session },
}) => {
  return (
    <>
      <Meta
        title={`Espace Agent Public - Subventions des Associations | Annuaire des Entreprises`}
        noIndex={true}
      />
      <div className="content-container">
        <Title
          ficheType={FICHE.AGENT_SUBVENTIONS}
          uniteLegale={uniteLegale}
          session={session}
        />
        <ProtectedSection title="Subventions des Associations" />
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    if (!isLoggedIn(context.req?.session)) {
      return {
        redirect: {
          destination: `/connexion/agent-public`,
          permanent: false,
        },
      };
    }

    const { slug } = extractParamsFromContext(context);
    const uniteLegale = await getUniteLegaleFromSlug(slug);
    console.log(await clientApiEntrepriseAssociation());

    return {
      props: {
        uniteLegale,
        metadata: { useReact: true },
      },
    };
  }
);

export default OctroiPage;
