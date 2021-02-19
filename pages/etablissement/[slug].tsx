import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import {
  Etablissement,
  getEtablissement,
  getUniteLegale,
  UniteLegale,
} from '../../models';
import EtablissementSection from '../../components/etablissement-section';
import Title from '../../components/title-section';
import {
  redirectPageNotFound,
  redirectSiretIntrouvable,
} from '../../utils/redirect';
import NonDiffusible from '../../components/non-diffusible';
import { isSiret } from '../../utils/helper';

interface IProps {
  etablissement: Etablissement;
  uniteLegale: UniteLegale;
  isNonDiffusible?: boolean;
}

const EtablissementPage: React.FC<IProps> = ({
  etablissement,
  uniteLegale,
  isNonDiffusible = false,
}) => (
  <Page
    small={true}
    title={`Etablissement - ${uniteLegale.nom_complet} - ${etablissement.siret}`}
  >
    <div className="content-container">
      <br />
      <a href={`/entreprise/${uniteLegale.siren}`}>← Fiche entité</a>
      <Title
        name={uniteLegale.nom_complet}
        siren={uniteLegale.siren}
        siret={etablissement.siret}
        isEntreprise={false}
        isOpen={etablissement.etat_administratif_etablissement === 'A'}
        isNonDiffusible={isNonDiffusible}
        isSiege={
          !!etablissement.is_siege ||
          etablissement.etablissement_siege === 'true'
        }
      />
      {isNonDiffusible ? (
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
  const slug = context.params.slug as string;

  const siret = slug;

  // does not match a siren
  if (!isSiret(siret)) {
    redirectPageNotFound(context.res, slug);
    return { props: {} };
  }

  const etablissement = await getEtablissement(siret as string);

  if (!etablissement) {
    redirectSiretIntrouvable(context.res, siret as string);
    return { props: {} };
  }

  console.log(JSON.stringify(etablissement));

  //@ts-ignore
  const uniteLegale = await getUniteLegale(etablissement.siren as string);

  if (!uniteLegale) {
    redirectSiretIntrouvable(context.res, siret as string);
    return { props: {} };
  }

  return {
    props: {
      etablissement,
      uniteLegale,
      isNonDiffusible: uniteLegale.statut_diffusion === 'N',
    },
  };
};

export default EtablissementPage;
