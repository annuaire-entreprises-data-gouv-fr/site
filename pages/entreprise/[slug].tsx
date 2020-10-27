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
import EntrepriseSection from '../../components/entrepriseSection';
import EtablissementListeSection from '../../components/etablissementListeSection';
import Title from '../../components/titleSection';
import redirect from '../../utils/redirect';

interface IProps {
  etablissement: Etablissement;
  uniteLegale: UniteLegale;
  isEntreprise: boolean; // true if entreprise, false if etablissement
}

const About: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  isEntreprise = false,
}) => (
  <Page
    small={true}
    title={`Page entreprise - ${getCompanyTitle(uniteLegale)} - ${
      uniteLegale.siren
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
        isEntreprise={isEntreprise}
        isSiege={etablissement.etat_administratif === 'A'}
        isNonDiffusible={uniteLegale.statut_diffusion === 'N'}
      />
      {!isEntreprise && (
        <EtablissementSection
          etablissement={etablissement}
          uniteLegale={uniteLegale}
        />
      )}
      <EntrepriseSection uniteLegale={uniteLegale} />
      <EtablissementListeSection uniteLegale={uniteLegale} />
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
  const siretOrSiren = context.params.slug;

  if (siretOrSiren && siretOrSiren.length === 9) {
    // siege social
    const uniteLegale = await getUniteLegale(siretOrSiren as string);

    if (uniteLegale.statut_diffusion === 'N') {
      redirect(context.res, `/introuvable/siren?q=${siretOrSiren}`);
    }

    return {
      props: {
        etablissement: uniteLegale.etablissement_siege || {},
        uniteLegale,
        isEntreprise: true,
      },
    };
  }

  const etablissement = await getEtablissement(siretOrSiren as string);
  const uniteLegale = await getUniteLegale(etablissement.siren as string);

  if (uniteLegale.statut_diffusion === 'N') {
    redirect(context.res, `/introuvable/siret?q=${siretOrSiren}`);
  }

  return {
    props: {
      etablissement,
      uniteLegale,
      isEntreprise: false,
    },
  };
};

export default About;
