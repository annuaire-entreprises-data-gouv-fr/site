import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import {
  getEtablissement,
  getUniteLegale,
  IEtablissement,
  IUniteLegale,
} from '../../models';
import EtablissementSection from '../../components/etablissement-section';
import Title from '../../components/title-section';
import {
  redirectPageNotFound,
  redirectSiretIntrouvable,
} from '../../utils/redirect';
import NonDiffusible from '../../components/non-diffusible';
import { isSiret } from '../../utils/helpers/siren-and-siret';
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
    title={`Etablissement - ${uniteLegale.fullName} - ${etablissement.siret}`}
  >
    <div className="content-container">
      <br />
      <a href={`/entreprise/${uniteLegale.siren}`}>← Fiche entité</a>
      <Title
        name={uniteLegale.fullName}
        siren={uniteLegale.siren}
        siret={etablissement.siret}
        isEntreprise={false}
        isActive={etablissement.isActive}
        isDiffusible={uniteLegale.isDiffusible}
        isSiege={!!etablissement.isSiege}
      />
      {uniteLegale.isDiffusible ? (
        <>
          <p>
            Cette établissement est <b>non-diffusible.</b>
          </p>
          <NonDiffusible />
        </>
      ) : (
        <EtablissementSection
          etablissement={etablissement}
          uniteLegale={uniteLegale}
        />
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
    const etablissementWithUniteLegale = await getEtablissementWithUniteLegale(siret);

    return {
      props: {
        ...etablissementWithUniteLegale,
      },
    };
  } catch (e) {
    if (e instanceof NotASiretError) {
      redirectPageNotFound(context.res, slug);
    }
    if (e instanceof SirenNotFoundError) {
      redirectSirenIntrouvable(context.res, siren);
    }
    return { props: {} };
  }
  // does not match a siren
  if (!isSiret(siret)) {
    redirectPageNotFound(context.res, siret);
    return { props: {} };
  }

    siret
  );

  return {
    props: {
      ...etablissementWithUniteLegale,
    },
  };
};

export default EtablissementPage;
