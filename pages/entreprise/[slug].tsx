import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { isSiren } from '../../utils/helpers/siren-and-siret';
import { getUniteLegale, IEtablissement, IUniteLegale } from '../../models';
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
  etablissement: IEtablissement;
  uniteLegale: IUniteLegale;
}

const About: React.FC<IProps> = ({ etablissement, uniteLegale }) => (
  <Page
    small={true}
    title={`Entité - ${uniteLegale.fullName} - ${uniteLegale.siren}`}
    canonical={`https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.page_path}`}
  >
    {/* <StructuredData data={structuredData(uniteLegale)} /> */}
    <div className="content-container">
      <Title
        name={uniteLegale.fullName}
        siren={uniteLegale.siren}
        siret={etablissement.siret}
        isEntreprise={true}
        isActive={etablissement.isActive}
        isDiffusible={uniteLegale.isDiffusible}
      />
      {uniteLegale.isDiffusible ? (
        <>
          <p>
            Cette entité est <b>non-diffusible.</b>
          </p>
          <NonDiffusible />
        </>
      ) : (
        <>
          <EntrepriseSection uniteLegale={uniteLegale} />
          {uniteLegale.siege && (
            <EtablissementSection
              uniteLegale={uniteLegale}
              etablissement={uniteLegale.siege}
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

  const uniteLegale = await getUniteLegale(siren);

  if (!uniteLegale) {
    redirectSirenIntrouvable(context.res, siren);
    return { props: {} };
  }

  return {
    props: {
      //@ts-ignore
      etablissement: uniteLegale.etablissement_siege || {},
      uniteLegale,
    },
  };
};

export default About;
