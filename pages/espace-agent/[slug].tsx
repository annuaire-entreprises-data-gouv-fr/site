import { GetServerSideProps } from 'next';
import React from 'react';
import Meta from '#components/meta';
import { NonDiffusibleSection } from '#components/non-diffusible';
import Title from '#components/title-section';
import { FICHE } from '#components/title-section/tabs';
import { IUniteLegale } from '#models/index';
import { estNonDiffusible } from '#models/statut-diffusion';
import { getUniteLegaleFromSlug } from '#models/unite-legale';
import { getCompanyPageDescription, getCompanyPageTitle } from '#utils/helpers';
import extractParamsFromContext from '#utils/server-side-props-helper/extract-params-from-context';
import {
  postServerSideProps,
  IPropsWithMetadata,
} from '#utils/server-side-props-helper/post-server-side-props';
import { isSuperAgent } from '#utils/session';
import { NextPageWithLayout } from 'pages/_app';
import ConformiteSection from '#components/espace-agent-components/conformite-section';

interface IProps extends IPropsWithMetadata {
  uniteLegale: IUniteLegale;
  redirected: boolean;
}

const UniteLegalePage: NextPageWithLayout<IProps> = ({
  uniteLegale,
  metadata: { session },
}) => (
  <>
    <Meta
      title={getCompanyPageTitle(uniteLegale, session)}
      description={getCompanyPageDescription(uniteLegale, session)}
      noIndex={true}
      canonical={`https://annuaire-entreprises.data.gouv.fr/espace-agent/${
        uniteLegale.chemin || uniteLegale.siren
      }`}
    />
    <div className="content-container">
      <Title
        uniteLegale={uniteLegale}
        ficheType={FICHE.AGENTS}
        session={session}
      />
      {estNonDiffusible(uniteLegale) ? (
        <NonDiffusibleSection />
      ) : (
        <ConformiteSection uniteLegale={uniteLegale} />
      )}
    </div>
  </>
);

export const getServerSideProps: GetServerSideProps = postServerSideProps(
  async (context) => {
    if (!isSuperAgent(context.req?.session)) {
      return {
        redirect: {
          destination: `/connexion/agent-public`,
          permanent: false,
        },
      };
    }

    const { slug } = extractParamsFromContext(context);
    const uniteLegale = await getUniteLegaleFromSlug(slug);
    return {
      props: {
        uniteLegale,
        metadata: { useReact: true },
      },
    };
  }
);

export default UniteLegalePage;
