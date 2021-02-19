import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { isSiren } from '../../utils/helper';
import { Etablissement, getUniteLegale, UniteLegale } from '../../models';
import EntrepriseSection from '../../components/entreprise-section';
import EtablissementListeSection from '../../components/etablissement-liste-section';
import Title from '../../components/title-section';
import {
  redirectPageNotFound,
  redirectSirenIntrouvable,
} from '../../utils/redirect';
import EtablissementSection from '../../components/etablissement-section';

import NonDiffusible from '../../components/non-diffusible';

// const structuredData = (uniteLegale: UniteLegale) => [
//   ['Quel est le SIREN de cette entreprise?', `SIREN : ${uniteLegale.siren}`],
// ];

interface IProps {
  etablissement: Etablissement;
  uniteLegale: UniteLegale;
  isNonDiffusible?: boolean;
}

const About: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  isNonDiffusible,
}) => (
  <Page
    small={true}
    title={`Entité - ${uniteLegale.nom_complet} - ${uniteLegale.siren}`}
    canonical={`https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.page_path}`}
  >
    {/* <StructuredData data={structuredData(uniteLegale)} /> */}
    <div className="content-container">
      <Title
        name={uniteLegale.nom_complet}
        siren={uniteLegale.siren}
        siret={etablissement.siret}
        isEntreprise={true}
        isOpen={etablissement.etat_administratif_etablissement === 'A'}
        isNonDiffusible={isNonDiffusible}
      />
      {uniteLegale.statut_diffusion === 'N' ? (
        <>
          <p>
            Cette entité est <b>non-diffusible.</b>
          </p>
          <NonDiffusible />
        </>
      ) : (
        <>
          <EntrepriseSection uniteLegale={uniteLegale} />
          {uniteLegale.etablissement_siege && (
            <EtablissementSection
              uniteLegale={uniteLegale}
              etablissement={uniteLegale.etablissement_siege}
              usedInEntreprisePage={true}
            />
          )}
          <EtablissementListeSection uniteLegale={uniteLegale} />
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

  // does not match a siren
  if (!isSiren(siren)) {
    redirectPageNotFound(context.res, slug);
    return { props: {} };
  }

  const uniteLegale = await getUniteLegale(siren as string);

  if (!uniteLegale) {
    redirectSirenIntrouvable(context.res, siren as string);
    return { props: {} };
  }

  return {
    props: {
      //@ts-ignore
      etablissement: uniteLegale.etablissement_siege || {},
      uniteLegale,
      isNonDiffusible: uniteLegale.statut_diffusion === 'N',
    },
  };
};

export default About;
