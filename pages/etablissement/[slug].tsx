import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import {
  Etablissement,
  getEtablissement,
  getUniteLegale,
  UniteLegale,
} from '../../model';
import EtablissementSection from '../../components/etablissementSection';
import Title from '../../components/titleSection';
import { redirectSiretIntrouvable } from '../../utils/redirect';
import NonDiffusible from '../../components/nonDiffusible';

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
    title={`Page etablissement - ${uniteLegale.nom_complet} - ${etablissement.siret}`}
  >
    <div className="content-container">
      <br />
      <a href={`/entreprise/${uniteLegale.siren}`}>← Fiche entité</a>
      <Title
        name={uniteLegale.nom_complet}
        siren={uniteLegale.siren}
        siret={etablissement.siret}
        isEntreprise={false}
        isOpen={
          (etablissement.etat_administratif_etablissement ||
            etablissement.etat_administratif) === 'A'
        }
        isNonDiffusible={isNonDiffusible}
      />
      {isNonDiffusible ? (
        <>
          <p>
            Cette entreprise est <b>non-diffusible.</b>
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
  const slug = context.params.slug;

  const siretOrSiren = slug;

  const etablissement = await getEtablissement(siretOrSiren as string);

  console.log(etablissement);

  if (!etablissement) {
    redirectSiretIntrouvable(context.res, siretOrSiren as string);
  }

  //@ts-ignore
  const uniteLegale = await getUniteLegale(etablissement.siren as string);

  if (!uniteLegale) {
    redirectSiretIntrouvable(context.res, siretOrSiren as string);
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
