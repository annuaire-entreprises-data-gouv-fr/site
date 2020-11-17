import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { getCompanyTitle, isSirenOrSiret } from '../../utils/helper';
import {
  Etablissement,
  getUniteLegale,
  UniteLegale,
} from '../../model';
import EntrepriseSection from '../../components/entrepriseSection';
import EtablissementListeSection from '../../components/etablissementListeSection';
import Title from '../../components/titleSection';
import redirect from '../../utils/redirect';
import EtablissementSection from '../../components/etablissementSection';
import StructuredDataFAQ from '../../components/StructuredDataFAQ';
import Annonces from '../../components/annonces';

const structuredData = (uniteLegale:UniteLegale) => [
    ["Quel est le SIREN de cette entreprise?",`SIREN : ${uniteLegale.siren}`]
    ]

interface IProps {
  etablissement: Etablissement;
  uniteLegale: UniteLegale;
}

const About: React.FC<IProps> = ({ etablissement, uniteLegale }) => (
  <Page
    small={true}
    title={`Page entreprise - ${getCompanyTitle(uniteLegale)} - ${
      uniteLegale.siren
    }`}
  >
    <StructuredDataFAQ data={structuredData(uniteLegale)} />
    <div className="content-container">
      <Title
        name={
          uniteLegale.statut_diffusion === 'N'
            ? 'Nom inconnu'
            : getCompanyTitle(uniteLegale)
        }
        siren={uniteLegale.siren}
        siret={etablissement.siret}
        isEntreprise={true}
        isSiege={etablissement.etat_administratif === 'A'}
        isNonDiffusible={uniteLegale.statut_diffusion === 'N'}
      />
      <EntrepriseSection uniteLegale={uniteLegale} />
      <EtablissementSection
        uniteLegale={uniteLegale}
        etablissement={uniteLegale.etablissement_siege}
        usedInEntreprisePage={true}
      />
      <Annonces siren={uniteLegale.siren} />
      <EtablissementListeSection uniteLegale={uniteLegale} />
    </div>
    <style jsx>{`
      .content-container {
        margin: 20px auto 40px;
      }
    `}</style>
  </Page>
);

const extractSiren = (slug: string) => {
  if (!slug) {
    return '';
  }
  const m = slug.match(/\d{9}/);

  return m ? m[0] : '';
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const slug = context.params.slug as string;

  const siren = extractSiren(slug);

  if (!isSirenOrSiret(siren)) {
    redirect(context.res, '/404');
  }

  // siege social
  const uniteLegale = await getUniteLegale(siren as string);

  if (uniteLegale.statut_diffusion === 'N') {
    redirect(context.res, `/introuvable/siren?q=${siren}`);
  }

  return {
    props: {
      etablissement: uniteLegale.etablissement_siege || {},
      uniteLegale,
      isEntreprise: true,
    },
  };
};

export default About;
