import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { getCompanyTitle } from '../../utils/helper';
import {
  Etablissement,
  getEtablissement,
  getUniteLegale,
  UniteLegale,
} from '../../model';
import EtablissementSection from '../../components/etablissementSection';
import Title from '../../components/titleSection';
import { redirectSiretIntrouvable } from '../../utils/redirect';

interface IProps {
  etablissement: Etablissement;
  uniteLegale: UniteLegale;
}

const EtablissementPage: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
}) => (
  <Page
    small={true}
    title={`Page etablissement - ${getCompanyTitle(uniteLegale)} - ${
      etablissement.siret
    }`}
  >
    <div className="content-container">
      <Title
        name={
          uniteLegale.statut_diffusion === 'N'
            ? 'Nom inconnu'
            : getCompanyTitle(uniteLegale)
        }
        siren={uniteLegale.siren}
        siret={etablissement.siret}
        isEntreprise={false}
        isSiege={etablissement.etat_administratif === 'A'}
        isNonDiffusible={uniteLegale.statut_diffusion === 'N'}
      />
      <EtablissementSection
        etablissement={etablissement}
        uniteLegale={uniteLegale}
      />
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
  const slug = context.params.slug;

  const siretOrSiren = slug;

  const etablissement = await getEtablissement(siretOrSiren as string);

  if (!etablissement) {
    redirectSiretIntrouvable(context.res, siretOrSiren as string);
  }

  //@ts-ignore
  const uniteLegale = await getUniteLegale(etablissement.siren as string);

  if (!uniteLegale || uniteLegale.statut_diffusion === 'N') {
    redirectSiretIntrouvable(context.res, siretOrSiren as string);
  }

  return {
    props: {
      etablissement,
      uniteLegale,
    },
  };
};

export default EtablissementPage;
