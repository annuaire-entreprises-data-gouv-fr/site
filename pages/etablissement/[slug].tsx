import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import {
  IEtablissement,
  IUniteLegale,
  NotASiretError,
  SirenNotFoundError,
  SiretNotFoundError,
} from '../../models';
import EtablissementSection from '../../components/etablissement-section';
import Title, { FICHE } from '../../components/title-section';
import {
  redirectPageNotFound,
  redirectServerError,
  redirectSirenIntrouvable,
  redirectSiretIntrouvable,
} from '../../utils/redirect';
import NonDiffusible from '../../components/non-diffusible';
import { getEtablissementWithUniteLegale } from '../../models/etablissement';

interface IProps {
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
}

const EtablissementPage: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
}) => (
  <Page
    small={true}
    title={`Etablissement - ${uniteLegale.nomComplet} - ${etablissement.siret}`}
  >
    <div className="content-container">
      <br />
      <a href={`/entreprise/${uniteLegale.siren}`}>← Fiche entité</a>
      <Title
        name={uniteLegale.nomComplet}
        siren={uniteLegale.siren}
        siret={etablissement.siret}
        isActive={etablissement.estActif}
        isDiffusible={uniteLegale.estDiffusible}
        isSiege={etablissement.estSiege}
        ficheType={FICHE.ETABLISSEMENT}
      />
      {uniteLegale.estDiffusible ? (
        <EtablissementSection
          etablissement={etablissement}
          uniteLegale={uniteLegale}
        />
      ) : (
        <>
          <p>
            Cette établissement est <b>non-diffusible.</b>
          </p>
          <NonDiffusible />
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siret = context.params.slug as string;

  try {
    const etablissementWithUniteLegale = await getEtablissementWithUniteLegale(
      siret
    );

    return {
      props: {
        ...etablissementWithUniteLegale,
      },
    };
  } catch (e) {
    if (e instanceof NotASiretError) {
      redirectPageNotFound(context.res, siret);
    } else if (e instanceof SiretNotFoundError) {
      redirectSiretIntrouvable(context.res, siret);
    } else if (e instanceof SirenNotFoundError) {
      redirectSirenIntrouvable(context.res, e.message);
    } else {
      redirectServerError(context.res, e.message);
    }

    return { props: {} };
  }
};

export default EtablissementPage;
