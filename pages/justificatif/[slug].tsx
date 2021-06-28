import React from 'react';

import { GetServerSideProps } from 'next';
import Page from '../../layouts';
import { Section } from '../../components/section';
import Title, { FICHE } from '../../components/title-section';
import getJustificatifs, { IJustificatifs } from '../../models/justificatifs';
import Immatriculations from '../../components/immatriculations';
import AvisSituation from '../../components/avis-situation';
import { EAdministration } from '../../models/administration';
import { redirectIfIssueWithSiren } from '../../utils/redirects/routers';
import { FullTable } from '../../components/table/full';
import { IEtablissement } from '../../models';
import { formatSiret } from '../../utils/helpers/siren-and-siret';
import { Tag } from '../../components/tag';
import IsActiveTag from '../../components/is-active-tag';

const JustificatifPage: React.FC<IJustificatifs> = ({
  uniteLegale,
  immatriculationRNM,
  immatriculationRNCS,
}) => (
  <Page
    small={true}
    title={`Justificatif d’immatricuation - ${uniteLegale.nomComplet}`}
    noIndex={true}
  >
    <div className="content-container">
      <Title uniteLegale={uniteLegale} ficheType={FICHE.JUSTIFICATIFS} />
      <Immatriculations
        immatriculationRNM={immatriculationRNM}
        immatriculationRNCS={immatriculationRNCS}
      />
      {uniteLegale.estDiffusible && (
        <Section title="Avis de situation INSEE" source={EAdministration.INSEE}>
          <div className="description">
            Chaque établissement immatriculé par l'INSEE au répertoire Sirene
            des entreprises possède un avis de situation.
          </div>
          <FullTable
            head={['SIRET', 'Adresse', 'Statut', 'Avis de situation']}
            body={uniteLegale.etablissements.map(
              (etablissement: IEtablissement) => [
                <a href={`/etablissement/${etablissement.siret}`}>
                  {formatSiret(etablissement.siret)}
                </a>,
                etablissement.adresse,
                <>
                  {!uniteLegale.estDiffusible ? (
                    <Tag>non-diffusible</Tag>
                  ) : (
                    <>
                      {etablissement.estSiege && <Tag>siège social</Tag>}
                      {!etablissement.estActif && (
                        <IsActiveTag isActive={etablissement.estActif} />
                      )}
                    </>
                  )}
                </>,
                <AvisSituation
                  siret={uniteLegale.siege.siret}
                  label="Télécharger"
                />,
              ]
            )}
          />
        </Section>
      )}
    </div>
    <style jsx>{`
      .separator {
        width: 10px;
        height: 10px;
      }
      .description {
        display: flex;
        margin-bottom: 20px;
        flex-direction: row;
      }
      .logo-wrapper {
        padding-left: 20px;
        width: calc(30% - 20px);
      }
      .logo-wrapper svg {
        width: 100%;
      }
      .content-container {
        margin: 20px auto 40px;
      }
      @media only screen and (min-width: 1px) and (max-width: 900px) {
        .description {
          flex-direction: column;
        }
        .logo-wrapper {
          margin: 20px auto 0;
          padding: 0;
        }
      }
    `}</style>
  </Page>
);

export const getServerSideProps: GetServerSideProps = async (context) => {
  //@ts-ignore
  const siren = context.params.slug as string;

  try {
    const justificatifs = await getJustificatifs(siren);

    return {
      props: justificatifs,
    };
  } catch (e) {
    redirectIfIssueWithSiren(context.res, e, siren, context.req);
    return { props: {} };
  }
};

export default JustificatifPage;
