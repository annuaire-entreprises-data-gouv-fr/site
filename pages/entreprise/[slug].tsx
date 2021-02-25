import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { getUniteLegale, IUniteLegale } from '../../models';
import EntrepriseSection from '../../components/entreprise-section';
import EtablissementListeSection from '../../components/etablissement-liste-section';
import Title from '../../components/title-section';
import {
  redirectPageNotFound,
  redirectSirenIntrouvable,
} from '../../utils/redirect';
import EtablissementSection from '../../components/etablissement-section';

import NonDiffusible from '../../components/non-diffusible';
import { NotASirenError, SirenNotFoundError } from '../../models/unite-legale';

// const structuredData = (uniteLegale: UniteLegale) => [
//   ['Quel est le SIREN de cette entreprise?', `SIREN : ${uniteLegale.siren}`],
// ];

interface IProps {
  uniteLegale: IUniteLegale;
}

const About: React.FC<IProps> = ({ uniteLegale }) => (
  <Page
    small={true}
    title={`Entité - ${uniteLegale.fullName} - ${uniteLegale.siren}`}
    canonical={`https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.path}`}
  >
    {/* <StructuredData data={structuredData(uniteLegale)} /> */}
    <div className="content-container">
      <Title
        name={uniteLegale.fullName}
        siren={uniteLegale.siren}
        siret={uniteLegale.siege.siret}
        isEntreprise={true}
        isActive={uniteLegale.siege.isActive}
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

  try {
    const uniteLegale = await getUniteLegale(siren);
    return {
      props: {
        uniteLegale,
      },
    };
  } catch (e) {
    if (e instanceof NotASirenError) {
      redirectPageNotFound(context.res, slug);
    }
    if (e instanceof SirenNotFoundError) {
      redirectSirenIntrouvable(context.res, siren);
    }
    return { props: {} };
  }
};

export default About;
