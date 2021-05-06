import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { IUniteLegale } from '../../models';
import UniteLegaleSection from '../../components/unite-legale-section';
import EtablissementListeSection from '../../components/etablissement-liste-section';
import Title, { FICHE } from '../../components/title-section';

import EtablissementSection from '../../components/etablissement-section';

import { NonDiffusibleSection } from '../../components/non-diffusible';
import { getUniteLegaleFromSlug } from '../../models/unite-legale';
import { parseIntWithDefaultValue } from '../../utils/helpers/formatting';
import AssociationSection from '../../components/association-section';
import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';

// const structuredData = (uniteLegale: UniteLegale) => [
//   ['Quel est le SIREN de cette entreprise?', `SIREN : ${uniteLegale.siren}`],
// ];

interface IProps {
  uniteLegale: IUniteLegale;
}

const UniteLegalePage: React.FC<IProps> = ({ uniteLegale }) => (
  <Page
    small={true}
    title={`Entité - ${uniteLegale.nomComplet} - ${uniteLegale.siren}`}
    canonical={`https://annuaire-entreprises.data.gouv.fr/entreprise/${uniteLegale.chemin}`}
    noIndex={
      uniteLegale.estEntrepreneurIndividuel && uniteLegale.estActive === false
    }
  >
    {/* <StructuredData data={structuredData(uniteLegale)} /> */}
    <div className="content-container">
      <Title uniteLegale={uniteLegale} ficheType={FICHE.INFORMATION} />
      {uniteLegale.estDiffusible ? (
        <>
          <UniteLegaleSection uniteLegale={uniteLegale} />
          {uniteLegale.association && uniteLegale.association.id && (
            <AssociationSection uniteLegale={uniteLegale} />
          )}
          {uniteLegale.siege && (
            <EtablissementSection
              uniteLegale={uniteLegale}
              etablissement={uniteLegale.siege}
              usedInEntreprisePage={true}
            />
          )}
          <EtablissementListeSection uniteLegale={uniteLegale} />
        </>
      ) : (
        <>
          <p>
            Cette entité est <b>non-diffusible.</b>
          </p>
          <NonDiffusibleSection />
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
  const pageParam = (context.query.page || '') as string;

  const siren = extractSiren(slug);
  const page = parseIntWithDefaultValue(pageParam, 1);

  try {
    const uniteLegale = await getUniteLegaleFromSlug(siren, page);
    return {
      props: {
        uniteLegale,
      },
    };
  } catch (e) {
    redirectIfIssueWithSiren(context.res, e, siren);
    return { props: {} };
  }
};

export default UniteLegalePage;
