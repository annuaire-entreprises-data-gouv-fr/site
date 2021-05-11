import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { IEtablissement, IUniteLegale } from '../../models';
import EtablissementSection from '../../components/etablissement-section';
import Title, { FICHE } from '../../components/title-section';
import { NonDiffusibleSection } from '../../components/non-diffusible';
import { getEtablissementWithUniteLegaleFromSlug } from '../../models/etablissement';
import { redirectIfIssueWithSiretOrSiren } from '../../utils/redirects/routers';
import { TitleEtablissementWithDenomination } from '../../components/title-etablissement-section';

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
    title={`Etablissement - ${uniteLegale.nomComplet} - ${etablissement.siret}`}
  >
    <div className="content-container">
      <Title uniteLegale={uniteLegale} ficheType={FICHE.INFORMATION} />
      <TitleEtablissementWithDenomination
        uniteLegale={uniteLegale}
        etablissement={etablissement}
      />
      <br />
      {uniteLegale.estDiffusible ? (
        <EtablissementSection
          etablissement={etablissement}
          uniteLegale={uniteLegale}
        />
      ) : (
        <>
          <p>
            Cet établissement est <b>non-diffusible.</b>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siret = context.params.slug as string;

  try {
    const etablissementWithUniteLegale = await getEtablissementWithUniteLegaleFromSlug(
      siret
    );

    return {
      props: {
        ...etablissementWithUniteLegale,
      },
    };
  } catch (e) {
    redirectIfIssueWithSiretOrSiren(context.res, e, siret, context.req);
    return { props: {} };
  }
};

export default EtablissementPage;
