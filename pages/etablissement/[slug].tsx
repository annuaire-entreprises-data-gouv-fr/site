import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { IEtablissement, IUniteLegale } from '../../models';
import EtablissementSection from '../../components/etablissement-section';
import Title, { FICHE } from '../../components/title-section';
import { NonDiffusibleSection } from '../../components/non-diffusible';
import { getEtablissementWithUniteLegale } from '../../models/etablissement';
import { Tag } from '../../components/tag';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import IsActiveTag from '../../components/is-active-tag';
import { capitalize } from '../../utils/helpers/formatting';
import {
  redirectIfIssueWithSiren,
  redirectIfIssueWithSiret,
} from '../../utils/redirects/routers';

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
      <div className="sub-title">
        <h2>
          Information sur un établissement de{' '}
          <a href={`/entreprise/${uniteLegale.siren}`}>
            {capitalize(uniteLegale.nomComplet)}
          </a>
        </h2>
        <span>établissement ‣ {formatSiret(etablissement.siret)}</span>
        {etablissement.estSiege && <Tag>siège social</Tag>}
        <IsActiveTag isActive={etablissement.estActif} />
      </div>
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
      .sub-title > span {
        color: #666;
        font-variant: small-caps;
        font-size: 1.1rem;
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siret = context.params.slug as string;

  try {
    const etablissementWithUniteLegale = await getEtablissementWithUniteLegale(
      siret
    );

    return {
      props: {
        ...etablissementWithUniteLegale,
      },
    };
  } catch (e) {
    redirectIfIssueWithSiret(context.res, e, siret);
    redirectIfIssueWithSiren(context.res, e, siret);
    return { props: {} };
  }
};

export default EtablissementPage;
